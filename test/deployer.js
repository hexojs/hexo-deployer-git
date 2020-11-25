'use strict';

const should = require('chai').should(); // eslint-disable-line
const pathFn = require('path');
const util = require('hexo-util');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const spawn = util.spawn;

describe('deployer', () => {
  const baseDir = pathFn.join(__dirname, 'deployer_test');
  const publicDir = pathFn.join(baseDir, 'public');
  const fakeRemote = pathFn.join(baseDir, 'remote');
  const validateDir = pathFn.join(baseDir, 'validate');
  const extendDir = pathFn.join(baseDir, 'extend');

  const ctx = {
    base_dir: baseDir,
    public_dir: publicDir,
    log: {
      info: () => {}
    }
  };

  const deployer = require('../lib/deployer').bind(ctx);

  before(() => {
    return fs.writeFile(pathFn.join(publicDir, 'foo.txt'), 'foo');
  });

  beforeEach(() => {
    // Create a bare repo as a fake remote repo
    return fs.mkdirs(fakeRemote).then(() => {
      return spawn('git', ['init', '--bare', fakeRemote]);
    });
  });

  after(() => {
    return fs.rmdir(baseDir);
  });

  afterEach(() => {
    return fs.rmdir(fakeRemote).then(() => {
      return fs.rmdir(validateDir);
    });
  });

  function validate(branch) {
    branch = branch || 'main';

    // Clone the remote repo
    return spawn('git', ['clone', fakeRemote, validateDir, '--branch', branch]).then(() => {
      // Check the branch name
      return fs.readFile(pathFn.join(validateDir, '.git', 'HEAD'));
    }).then(content => {
      content.trim().should.eql('ref: refs/heads/' + branch);

      // Check files
      return fs.readFile(pathFn.join(validateDir, 'foo.txt'));
    }).then(content => {
      content.should.eql('foo');
    });
  }

  it('default', () => {
    return deployer({
      repo: fakeRemote,
      silent: true
    }).then(() => {
      return validate();
    });
  });

  it('custom branch', () => {
    return deployer({
      repo: fakeRemote,
      branch: 'custom',
      silent: true
    }).then(() => {
      return validate('custom');
    });
  });

  it.skip('custom message', () => {
    return deployer({
      repo: fakeRemote,
      message: 'custom message',
      silent: true
    }).then(() => {
      return validate();
    }).then(() => {
      return spawn('git', ['log', '-1', '--pretty=format:%s'], {cwd: validateDir});
    }).then(content => {
      content.should.eql('custom message');
    });
  });

  it('extend dirs', () => {
    const extendDirName = pathFn.basename(extendDir);

    return fs.writeFile(pathFn.join(extendDir, 'ext.txt'), 'ext')
      .then(() => {
        return deployer({
          repo: fakeRemote,
          extend_dirs: extendDirName,
          silent: true
        });
      }).then(() => {
        return validate();
      }).then(() => {
        const extTxtFile = pathFn.join(validateDir, extendDirName, 'ext.txt');

        return fs.readFile(extTxtFile);
      }).then(content => {
        content.should.eql('ext');
      });
  });

  it('multi deployment', () => {
    return deployer({
      repo: {
        github: fakeRemote,
        gitcafe: fakeRemote
      }
    }).then(() => {
      return validate();
    });
  });

  it('deployment with env', () => {
    process.env.HEXO_DEPLOYER_REPO = fakeRemote;
    return deployer({}).then(() => {
      return validate();
    });
  });

  it('hidden file', () => {
    return fs.writeFile(pathFn.join(publicDir, '.hid'), 'hidden')
      .then(() => {
        return deployer({
          repo: fakeRemote,
          ignore_hidden: false,
          silent: true
        });
      }).then(() => {
        return validate();
      }).then(() => {
        return fs.readFile(pathFn.join(validateDir, '.hid'));
      }).then(content => {
        content.should.eql('hidden');
      });
  });

  it('hidden extdir', () => {
    const extendDirName = pathFn.basename(extendDir);

    return fs.writeFile(pathFn.join(extendDir, '.hid'), 'hidden')
      .then(() => {
        return deployer({
          repo: fakeRemote,
          extend_dirs: extendDirName,
          ignore_hidden: {public: true, extend: false},
          silent: true
        });
      }).then(() => {
        return validate();
      }).then(() => {
        const extHidFile = pathFn.join(validateDir, extendDirName, '.hid');

        return fs.readFile(extHidFile);
      }).then(content => {
        content.should.eql('hidden');
      });
  });

  it('hidden files', () => {
    // with ignore_pattern
    const extendDirName = pathFn.basename(extendDir);

    const pubFileHid = fs.writeFile(pathFn.join(publicDir, 'hid'), 'hidden');
    const extFileHid = fs.writeFile(pathFn.join(extendDir, 'hid'), 'hidden');
    const extFileShow = fs.writeFile(pathFn.join(extendDir, 'show'), 'show');

    return Promise.all([pubFileHid, extFileHid, extFileShow])
      .then(() => {
        return deployer({
          repo: fakeRemote,
          extend_dirs: extendDirName,
          ignore_pattern: 'hid',
          silent: true
        });
      }).then(() => {
        return validate();
      }).then(() => {
        const isPubFileHidExisits = fs.exists(pathFn.join(validateDir, 'hid'));
        const isExtFileHidExisits = fs.exists(pathFn.join(validateDir, extendDirName, 'hid'));
        const isExtFileShowExisits = fs.exists(pathFn.join(validateDir, extendDirName, 'show'));

        return Promise.all([isPubFileHidExisits, isExtFileHidExisits, isExtFileShowExisits]);
      }).then(statusLists => {
        const pubFileHidStatus = statusLists[0];
        const extFileHidStatus = statusLists[1];
        const extFileShowStatus = statusLists[2];

        pubFileHidStatus.should.eql(false);
        extFileHidStatus.should.eql(false);
        extFileShowStatus.should.eql(true);
      }).then(() => {
        const extShowFile = pathFn.join(validateDir, extendDirName, 'show');

        return fs.readFile(extShowFile);
      }).then(content => {
        content.should.eql('show');
      });
  });

  it('hidden extFiles', () => {
    // with ignore_pattern
    const extendDirName = pathFn.basename(extendDir);

    const extFileHid = fs.writeFile(pathFn.join(extendDir, 'hid'), 'hidden');
    const extFile2Hid = fs.writeFile(pathFn.join(extendDir, 'hid2'), 'hidden');
    const pubFileHid = fs.writeFile(pathFn.join(publicDir, 'hid'), 'hidden');

    return Promise.all([extFileHid, extFile2Hid, pubFileHid])
      .then(() => {
        return deployer({
          repo: fakeRemote,
          extend_dirs: extendDirName,
          ignore_pattern: {public: 'hid', extend: '.'},
          silent: true
        });
      }).then(() => {
        return validate();
      }).then(() => {
        const isExtHidFileExists = fs.exists(pathFn.join(validateDir, extendDirName, 'hid'));
        const isExtHidFile2Exists = fs.exists(pathFn.join(validateDir, extendDirName, 'hid2'));
        const isPubHidFileExists = fs.exists(pathFn.join(validateDir, 'hid'));

        return Promise.all([isExtHidFileExists, isExtHidFile2Exists, isPubHidFileExists]);
      }).then(statusLists => {
        statusLists.forEach(statusItem => {
          statusItem.should.eql(false);
        });
      });
  });
});
