'use strict';

const rRepoURL = /^(?:(git|https?|git\+https|git\+ssh):\/\/)?(?:[^@]+@)?([^\/]+?)[\/:](.+?)\.git$/; // eslint-disable-line no-useless-escape
const rGithubPage = /\.github\.(io|com)$/;
const URL = require('url').URL;

function parseRepo(repo, configToken) {
  const split = repo.split(',');
  let url = split.shift();
  let branch = split[0];

  if (!branch && rRepoURL.test(url)) {
    const match = url.match(rRepoURL);
    const scheme = match[1];
    const host = match[2];
    const path = match[3];

    if (host === 'github.com') {
      branch = rGithubPage.test(path) ? 'master' : 'gh-pages';
    } else if (host === 'coding.net') {
      branch = 'coding-pages';
    }

    if (configToken && (scheme === 'http' || scheme === 'https')) {
      var repoUrl, userToken;
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

module.exports = function(args) {
  const repo = args.repo || args.repository;
  if (!repo) throw new TypeError('repo is required!');

  if (typeof repo === 'string') {
    const data = parseRepo(repo, args.token);
    data.branch = args.branch || data.branch;

    return [data];
  }

  const result = Object.keys(repo).map(key => {
    return parseRepo(repo[key], args.token);
  });

  return result;
};
