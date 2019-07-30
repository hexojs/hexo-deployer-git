'use strict';

const rRepoURL = /^(?:(?:git|https?|git\+https|git\+ssh):\/\/)?(?:[^@]+@)?([^\/]+?)[\/:](.+?)\.git$/; // eslint-disable-line no-useless-escape
const rGithubPage = /\.github\.(io|com)$/;

function parseRepo(repo) {
  const split = repo.split(',');
  const url = split.shift();
  let branch = split[0];

  if (!branch && rRepoURL.test(url)) {
    const match = url.match(rRepoURL);
    const host = match[1];
    const path = match[2];

    if (host === 'github.com') {
      branch = rGithubPage.test(path) ? 'master' : 'gh-pages';
    } else if (host === 'coding.net') {
      branch = 'coding-pages';
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
    const data = parseRepo(repo);
    data.branch = args.branch || data.branch;

    return [data];
  }

  const result = Object.keys(repo).map(key => {
    return parseRepo(repo[key]);
  });

  return result;
};
