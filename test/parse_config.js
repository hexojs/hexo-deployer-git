'use strict';

var should = require('chai').should(); // eslint-disable-line

describe('parse config', function() {
  var parseConfig = require('../lib/parse_config');

  it('single repo, no branch', function() {
    var result = parseConfig({
      repo: 'https://example.com/path/to/repo.git'
    });

    result.should.eql([
      {url: 'https://example.com/path/to/repo.git', branch: 'master'}
    ]);
  });

  it('single repo, with branch', function() {
    var result = parseConfig({
      repo: 'https://example.com/path/to/repo.git',
      branch: 'develop'
    });

    result.should.eql([
      {url: 'https://example.com/path/to/repo.git', branch: 'develop'}
    ]);
  });

  it('single repo, branch after url', function() {
    var result = parseConfig({
      repo: 'https://example.com/path/to/repo.git,develop'
    });

    result.should.eql([
      {url: 'https://example.com/path/to/repo.git', branch: 'develop'}
    ]);
  });

  it('multiple repo', function() {
    var result = parseConfig({
      repo: {
        foo: 'https://example.com/path/to/repo.git',
        bar: 'https://example.com/path/to/repo2.git,custom'
      }
    });

    result.should.eql([
      {url: 'https://example.com/path/to/repo.git', branch: 'master'},
      {url: 'https://example.com/path/to/repo2.git', branch: 'custom'}
    ]);
  });

  it('github repo, master branch', function() {
    // https
    parseConfig({
      repo: 'https://github.com/hexojs/hexojs.github.io.git'
    })[0].branch.should.eql('master');

    // git
    parseConfig({
      repo: 'git://github.com/hexojs/hexojs.github.io.git'
    })[0].branch.should.eql('master');

    // ssh
    parseConfig({
      repo: 'git@github.com:hexojs/hexojs.github.io.git'
    })[0].branch.should.eql('master');
  });

  it('github repo, gh-pages branch', function() {
    // https
    parseConfig({
      repo: 'https://github.com/hexojs/hexo.git'
    })[0].branch.should.eql('gh-pages');

    // git
    parseConfig({
      repo: 'git://github.com/hexojs/hexo.git'
    })[0].branch.should.eql('gh-pages');

    // ssh
    parseConfig({
      repo: 'git@github.com:hexojs/hexo.git'
    })[0].branch.should.eql('gh-pages');
  });

  it('github repo, custom branch', function() {
    parseConfig({
      repo: 'https://github.com/hexojs/hexojs.github.io.git',
      branch: 'site'
    })[0].branch.should.eql('site');
  });

  it('coding repo, coding-pages branch', function() {
    // https
    parseConfig({
      repo: 'https://coding.net/hexojs/hexojs.git'
    })[0].branch.should.eql('coding-pages');

    // git
    parseConfig({
      repo: 'git://coding.net/hexojs/hexojs.git'
    })[0].branch.should.eql('coding-pages');

    // ssh
    parseConfig({
      repo: 'git@coding.net/hexojs/hexojs.git'
    })[0].branch.should.eql('coding-pages');
  });

  it('coding, custom branch', function() {
    parseConfig({
      repo: 'https://coding.net/hexojs/hexojs.git',
      branch: 'site'
    })[0].branch.should.eql('site');
  });

  it('repo is required', function() {
    try {
      parseConfig({});
    } catch (err) {
      err.should.have.property('message', 'repo is required!');
    }
  });

  it('single repo with plain text token', function() {
    // http
    parseConfig({
      repo: {
        url: 'http://github.com/hexojs/hexojs.github.io.git',
        token: 'plain_text_token'
      }
    })[0].url.should.eql('http://plain_text_token@github.com/hexojs/hexojs.github.io.git');

    // token config for git scheme should be ignored
    parseConfig({
      repo: {
        url: 'git://github.com/hexojs/hexojs.github.io.git',
        token: 'plain_text_token'
      }
    })[0].url.should.eql('git://github.com/hexojs/hexojs.github.io.git');
  });

  it('single repo with env var token', function() {
    process.env.GIT_TOKEN = 'env_token';

    // http
    parseConfig({
      repo: {
        url: 'http://github.com/hexojs/hexojs.github.io.git',
        token: '$GIT_TOKEN'
      }
    })[0].url.should.eql('http://env_token@github.com/hexojs/hexojs.github.io.git');

    // token config for git scheme should be ignored
    parseConfig({
      repo: {
        url: 'git://github.com/hexojs/hexojs.github.io.git',
        token: '$GIT_TOKEN'
      }
    })[0].url.should.eql('git://github.com/hexojs/hexojs.github.io.git');

    delete process.env.GIT_TOKEN;
  });

  it('Structured single repo setting', function() {
    parseConfig({
      repo: {
        url: 'https://coding.net/hexojs/hexojs.git',
        branch: 'site'
      }
    })[0].branch.should.eql('site');
  });

  it('Single repo setting with name', function() {
    parseConfig({
      repo: {
        my_repo: 'https://coding.net/hexojs/hexojs.git,site'
      }
    })[0].branch.should.eql('site');
  });

  it('Single structured repo setting with name', function() {
    parseConfig({
      repo: {
        my_repo: {
          url: 'https://coding.net/hexojs/hexojs.git',
          branch: 'site'
        }
      }
    })[0].branch.should.eql('site');
  });

  it('Structured multiple repo settings', function() {
    process.env.GIT_TOKEN = 'env_token';
    const result = parseConfig({
      repo: {
        coding: {
          url: 'https://coding.net/hexojs/hexojs.git',
          branch: 'site'
        },
        github: {
          url: 'https://github.com/hexojs/hexojs.github.io.git',
          token: 'plain_token'
        },
        other: {
          url: 'https://example.com/path/to/repo.git',
          token: '$GIT_TOKEN',
          branch: 'page'
        }
      }
    });

    result.should.eql([
      {url: 'https://coding.net/hexojs/hexojs.git', branch: 'site'},
      {url: 'https://plain_token@github.com/hexojs/hexojs.github.io.git', branch: 'master'},
      {url: 'https://env_token@example.com/path/to/repo.git', branch: 'page'}
    ]);

    delete process.env.GIT_TOKEN;
  });

  it('fail to read env var token', function() {

    // http
    try {
      parseConfig({
        repo: {
          url: 'http://github.com/hexojs/hexojs.github.io.git',
          token: '$GIT_TOKEN'
        }
      });
    } catch (err) {
      err.should.have.property('message', 'Fail to read environment varable: $GIT_TOKEN, check your config!');
    }
  });

  it('invalid url', function() {
    try {
      parseConfig({
        repo: {
          url: 'http:///hexojs/hexojs.github.io.git',
          token: '$GIT_TOKEN'
        }
      });
    } catch (err) {
      err.should.have.property('message', 'Fail to parse your repo url, check your config!');
    }
  });
});
