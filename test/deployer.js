'use strict';

var should = require('chai').should(); // eslint-disable-line
var pathFn = require('path');
var util = require('hexo-util');
var fs = require('hexo-fs');
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
    return fs.writeFile(pathFn.join(publicDir, 'foo.txt'), 'foo')
      .then(function() {
        return fs.writeFile(pathFn.join(publicDir, '.hidden'), 'bar');
      });
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
    return fs.rmdir(fakeRemote)
      .then(function() {
        return fs.rmdir(pathFn.join(baseDir, '.deploy_git'));
      })
      .then(function() {
        return fs.rmdir(validateDir);
      });
  });

  function validate(branch, hiddenFileShouldExist) {
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
    }).then(function() {
      return validateHiddenFile(hiddenFileShouldExist);
    });
  }

  function validateHiddenFile(shouldExist) {
    return fs.exists(pathFn.join(validateDir, '.hidden'))
      .then(function(fileExists) {
        if(shouldExist) {
          fileExists.should.be.true;
        } else{
          fileExists.should.be.false;
        }
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

  it('hidden files', function() {
    return deployer({
      repo: fakeRemote,
      silent: true,
      keep_hidden_file: true
    }).then(function() {
      return validate('master', true);
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
});
