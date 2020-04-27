'use strict';

const rRepoURL = /^(?:(git|https?|git\+https|git\+ssh):\/\/)?(?:[^@]+@)?([^\/]+?)[\/:](.+?)\.git$/; // eslint-disable-line no-useless-escape
const rGithubPage = /\.github\.(io|com)$/;
const { URL } = require('url');

function parseObjRepo(repo) {
  let url = repo.url;
  let branch = repo.branch;
  const configToken = repo.token;

  if (!branch) {
    branch = testBranch(url);
  }
  if (rRepoURL.test(url)) {
    const match = url.match(rRepoURL);
    const scheme = match[1];

    if (configToken && (scheme === 'http' || scheme === 'https')) {
      let repoUrl, userToken;
      try {
        repoUrl = new URL(url);
      } catch (e) {
        throw new TypeError('Fail to parse your repo url, check your config!');
      }

      if (configToken.startsWith('$')) {
        userToken = process.env[configToken.substring(1)];
        if (!userToken) throw new TypeError('Fail to read environment varable: ' + configToken + ', check your config!');
      } else {
        userToken = configToken;
      }
      repoUrl.username = userToken;
      url = repoUrl.href;
    }
  }

  return {
    url: url,
    branch: branch || 'master'
  };
}

function parseStrRepo(repo) {
  const split = repo.split(',');
  const url = split.shift();
  let branch = split[0];

  if (!branch) {
    branch = testBranch(url);
  }

  return {
    url: url,
    branch: branch || 'master'
  };

}

function testBranch(repoUrl) {
  let branch;
  if (rRepoURL.test(repoUrl)) {
    const match = repoUrl.match(rRepoURL);
    const host = match[2];
    const path = match[3];

    if (host === 'github.com') {
      branch = rGithubPage.test(path) ? 'master' : 'gh-pages';
    } else if (host === 'coding.net') {
      branch = 'coding-pages';
    }
  }
  return branch;
}

module.exports = function(args) {
  const repo = args.repo || args.repository;
  if (!repo) throw new TypeError('repo is required!');

  if (typeof repo === 'string') {
    const data = parseStrRepo(repo);
    data.branch = args.branch || data.branch;

    return [data];
  }

  const keys = Object.keys(repo);

  if (keys.includes('url')) {
    return [parseObjRepo(repo)];
  }

  return keys.map(key => {
    const repoItem = repo[key];
    if (typeof repoItem === 'string') {
      const data = parseStrRepo(repoItem);
      return data;
    }

    return parseObjRepo(repo[key]);
  });

};
