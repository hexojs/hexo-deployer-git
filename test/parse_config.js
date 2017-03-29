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
});
