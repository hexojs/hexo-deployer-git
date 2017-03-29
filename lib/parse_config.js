'use strict';

var rRepoURL = /^(?:(?:git|https?|git\+https|git\+ssh):\/\/)?(?:[^@]+@)?([^\/]+?)[\/:](.+?)\.git$/;
var rGithubPage = /\.github\.(io|com)$/;

function parseRepo(repo) {
  var split = repo.split(',');
  var url = split.shift();
  var branch = split[0];

  if (!branch && rRepoURL.test(url)) {
    var match = url.match(rRepoURL);
    var host = match[1];
    var path = match[2];

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
  var repo = args.repo || args.repository;
  if (!repo) throw new TypeError('repo is required!');

  if (typeof repo === 'string') {
    var data = parseRepo(repo);
    data.branch = args.branch || data.branch;

    return [data];
  }

  var result = [];
  var keys = Object.keys(repo);

  for (var i = 0, len = keys.length; i < len; i++) {
    result.push(parseRepo(repo[keys[i]]));
  }

  return result;
};
