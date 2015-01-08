var should = require('chai').should();
var pathFn = require('path');
var Promise = require('bluebird');
var spawn = require('../lib/spawn');
var fs = require('hexo-fs');

describe('deployer', function(){
  var baseDir = pathFn.join(__dirname, 'deployer_test');
  var publicDir = pathFn.join(baseDir, 'public');
  var fakeRemote = pathFn.join(baseDir, 'remote');
  var validateDir = pathFn.join(baseDir, 'validate');

  var ctx = {
    base_dir: baseDir,
    public_dir: publicDir,
    log: {
      info: function(){}
    }
  };

  var deployer = require('../lib/deployer').bind(ctx);

  before(function(){
    return fs.writeFile(pathFn.join(publicDir, 'foo.txt'), 'foo');
  });

  beforeEach(function(){
    // Create a bare repo as a fake remote repo
    return fs.mkdirs(fakeRemote).then(function(){
      return spawn('git', ['init', '--bare', fakeRemote]);
    });
  });

  after(function(){
    return fs.rmdir(baseDir);
  });

  afterEach(function(){
    return Promise.all([
      fs.rmdir(fakeRemote),
      fs.rmdir(validateDir)
    ]);
  });

  function validate(branch){
    branch = branch || 'master';

    // Clone the remote repo
    return spawn('git', ['clone', fakeRemote, validateDir, '--branch', branch]).then(function(){
      // Check the branch name
      return fs.readFile(pathFn.join(validateDir, '.git', 'HEAD'));
    }).then(function(content){
      content.trim().should.eql('ref: refs/heads/' + branch);

      // Check files
      return fs.readFile(pathFn.join(validateDir, 'foo.txt'));
    }).then(function(content){
      content.should.eql('foo');
    });
  }

  it('default', function(){
    return deployer({
      repo: fakeRemote
    }).then(function(){
      return validate();
    });
  });

  it('custom branch', function(){
    return deployer({
      repo: fakeRemote,
      branch: 'custom'
    }).then(function(){
      return validate('custom');
    });
  });

  it.skip('custom message', function(){
    return deployer({
      repo: fakeRemote,
      message: 'custom message'
    }).then(function(){
      return validate();
    }).then(function(){
      return spawn('git', ['log', '-1', '--pretty=format:%s'], {cwd: validateDir});
    }).then(function(content){
      content.should.eql('custom message');
    });
  });
});