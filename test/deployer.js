'use strict';

var should = require('chai').should(); // eslint-disable-line
var pathFn = require('path');
var util = require('hexo-util');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var spawn = util.spawn;

describe('deployer', function() {
  var baseDir = pathFn.join(__dirname, 'deployer_test');
  var publicDir = pathFn.join(baseDir, 'public');
  var fakeRemote = pathFn.join(baseDir, 'remote');
  var validateDir = pathFn.join(baseDir, 'validate');
  var extendDir = pathFn.join(baseDir, 'extend');

  var ctx = {
    base_dir: baseDir,
    public_dir: publicDir,
    log: {
      info: function() {}
    }
  };

  var deployer = require('../lib/deployer').bind(ctx);

  before(function() {
    return fs.writeFile(pathFn.join(publicDir, 'foo.txt'), 'foo');
  });

  beforeEach(function() {
    // Create a bare repo as a fake remote repo
    return fs.mkdirs(fakeRemote).then(function() {
      return spawn('git', ['init', '--bare', fakeRemote]);
    });
  });

  after(function() {
    return fs.rmdir(baseDir);
  });

  afterEach(function() {
    return fs.rmdir(fakeRemote).then(function() {
      return fs.rmdir(validateDir);
    });
  });

  function validate(branch) {
    branch = branch || 'master';

    // Clone the remote repo
    return spawn('git', ['clone', fakeRemote, validateDir, '--branch', branch]).then(function() {
      // Check the branch name
      return fs.readFile(pathFn.join(validateDir, '.git', 'HEAD'));
    }).then(function(content) {
      content.trim().should.eql('ref: refs/heads/' + branch);

      // Check files
      return fs.readFile(pathFn.join(validateDir, 'foo.txt'));
    }).then(function(content) {
      content.should.eql('foo');
    });
  }

  it('default', function() {
    return deployer({
      repo: fakeRemote,
      silent: true
    }).then(function() {
      return validate();
    });
  });

  it('custom branch', function() {
    return deployer({
      repo: fakeRemote,
      branch: 'custom',
      silent: true
    }).then(function() {
      return validate('custom');
    });
  });

  it.skip('custom message', function() {
    return deployer({
      repo: fakeRemote,
      message: 'custom message',
      silent: true
    }).then(function() {
      return validate();
    }).then(function() {
      return spawn('git', ['log', '-1', '--pretty=format:%s'], {cwd: validateDir});
    }).then(function(content) {
      content.should.eql('custom message');
    });
  });

  it('extend dirs', function() {
    var extendDirName = pathFn.basename(extendDir);

    return fs.writeFile(pathFn.join(extendDir, 'ext.txt'), 'ext')
    .then(function() {
      return deployer({
        repo: fakeRemote,
        extend_dirs: extendDirName,
        silent: true
      });
    }).then(function() {
      return validate();
    }).then(function() {
      var extTxtFile = pathFn.join(validateDir, extendDirName, 'ext.txt');

      return fs.readFile(extTxtFile);
    }).then(function(content) {
      content.should.eql('ext');
    });
  });

  it('multi deployment', function() {
    return deployer({
      repo: {
        github: fakeRemote,
        gitcafe: fakeRemote
      }
    }).then(function() {
      return validate();
    });
  });

  it('deployment with env', function() {
    process.env.HEXO_DEPLOYER_REPO = fakeRemote;
    return deployer({}).then(function() {
      return validate();
    });
  });

  it('hidden file', function() {
    return fs.writeFile(pathFn.join(publicDir, '.hid'), 'hidden')
    .then(function() {
      return deployer({
        repo: fakeRemote,
        ignore_hidden: false,
        silent: true
      });
    }).then(function() {
      return validate();
    }).then(function() {
      return fs.readFile(pathFn.join(validateDir, '.hid'));
    }).then(function(content) {
      content.should.eql('hidden');
    });
  });

  it('hidden extdir', function() {
    var extendDirName = pathFn.basename(extendDir);

    return fs.writeFile(pathFn.join(extendDir, '.hid'), 'hidden')
    .then(function() {
      return deployer({
        repo: fakeRemote,
        extend_dirs: extendDirName,
        ignore_hidden: {public: true, extend: false},
        silent: true
      });
    }).then(function() {
      return validate();
    }).then(function() {
      var extHidFile = pathFn.join(validateDir, extendDirName, '.hid');

      return fs.readFile(extHidFile);
    }).then(function(content) {
      content.should.eql('hidden');
    });
  });

  it('hidden files', function() {
    // with ignore_pattern
    var extendDirName = pathFn.basename(extendDir);

    var pubFileHid = fs.writeFile(pathFn.join(publicDir, 'hid'), 'hidden');
    var extFileHid = fs.writeFile(pathFn.join(extendDir, 'hid'), 'hidden');
    var extFileShow = fs.writeFile(pathFn.join(extendDir, 'show'), 'show');

    return Promise.all([pubFileHid, extFileHid, extFileShow])
    .then(function() {
      return deployer({
        repo: fakeRemote,
        extend_dirs: extendDirName,
        ignore_pattern: 'hid',
        silent: true
      });
    }).then(function() {
      return validate();
    }).then(function() {
      var isPubFileHidExisits = fs.exists(pathFn.join(validateDir, 'hid'));
      var isExtFileHidExisits = fs.exists(pathFn.join(validateDir, extendDirName, 'hid'));
      var isExtFileShowExisits = fs.exists(pathFn.join(validateDir, extendDirName, 'show'));

      return Promise.all([isPubFileHidExisits, isExtFileHidExisits, isExtFileShowExisits]);
    }).then(function(statusLists) {
      var pubFileHidStatus = statusLists[0];
      var extFileHidStatus = statusLists[1];
      var extFileShowStatus = statusLists[2];

      pubFileHidStatus.should.eql(false);
      extFileHidStatus.should.eql(false);
      extFileShowStatus.should.eql(true);
    }).then(function() {
      var extShowFile = pathFn.join(validateDir, extendDirName, 'show');

      return fs.readFile(extShowFile);
    }).then(function(content) {
      content.should.eql('show');
    });
  });

  it('hidden extFiles', function() {
    // with ignore_pattern
    var extendDirName = pathFn.basename(extendDir);

    var extFileHid = fs.writeFile(pathFn.join(extendDir, 'hid'), 'hidden');
    var extFile2Hid = fs.writeFile(pathFn.join(extendDir, 'hid2'), 'hidden');
    var pubFileHid = fs.writeFile(pathFn.join(publicDir, 'hid'), 'hidden');

    return Promise.all([extFileHid, extFile2Hid, pubFileHid])
    .then(function() {
      return deployer({
        repo: fakeRemote,
        extend_dirs: extendDirName,
        ignore_pattern: {public: 'hid', extend: '.'},
        silent: true
      });
    }).then(function() {
      return validate();
    }).then(function() {
      var isExtHidFileExists = fs.exists(pathFn.join(validateDir, extendDirName, 'hid'));
      var isExtHidFile2Exists = fs.exists(pathFn.join(validateDir, extendDirName, 'hid2'));
      var isPubHidFileExists = fs.exists(pathFn.join(validateDir, 'hid'));

      return Promise.all([isExtHidFileExists, isExtHidFile2Exists, isPubHidFileExists]);
    }).then(function(statusLists) {
      statusLists.forEach(function(statusItem) {
        statusItem.should.eql(false);
      });
    });
  });

  it('keep history', function() {
    var otherRemote = pathFn.join(baseDir, 'other-remote');
    function addCommit() {
      return spawn('git', ['clone', fakeRemote, otherRemote], {cwd: baseDir})
      .then(function() {
        return spawn('git', ['commit', '--allow-empty', '-m', 'Test Commit'], {cwd: otherRemote}).catch(function(e) { console.log(e); })
      }).then(function() {
        return spawn('git', ['push', 'origin', 'master'], {cwd: otherRemote})
      });
    }

    return addCommit().then(function() {
      return deployer({
        repo: fakeRemote,
        silent: true,
        keep_history: true
      }).then(function() {
        return validate();
      }).then(function() {
        return spawn('git', ['log', '--skip', '1', '--pretty=format:%s'], {cwd: validateDir})
      }).then(function(logs) {
        logs.should.match(/Test Commit$/);
      });
    });
  });
});
