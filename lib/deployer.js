'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const { underline } = require('picocolors');
const nunjucks = require('nunjucks');
const { DateTime } = require('luxon');
const Promise = require('bluebird');
const { spawn } = require('hexo-util');
const parseConfig = require('./parse_config');

const swigHelpers = {
  now: function(format) {
    return DateTime.now().toFormat(format);
  }
};

module.exports = function(args) {
  const baseDir = this.base_dir;
  const deployDir = pathFn.join(baseDir, '.deploy_git');
  const publicDir = this.public_dir;
  let extendDirs = args.extend_dirs;
  const ignoreHidden = args.ignore_hidden;
  const ignorePattern = args.ignore_pattern;
  const log = this.log;
  const message = commitMessage(args);
  const verbose = !args.silent;

  if (!args.repo && process.env.HEXO_DEPLOYER_REPO) {
    args.repo = process.env.HEXO_DEPLOYER_REPO;
  }

  if (!args.repo && !args.repository) {
    let help = '';

    help += 'You have to configure the deployment settings in _config.yml first!\n\n';
    help += 'Example:\n';
    help += '  deploy:\n';
    help += '    type: git\n';
    help += '    repo: <repository url>\n';
    help += '    branch: [branch]\n';
    help += '    message: [message]\n\n';
    help += '    extend_dirs: [extend directory]\n\n';
    help += 'For more help, you can check the docs: ' + underline('https://hexo.io/docs/deployment.html');

    console.log(help);
    return;
  }

  function git(...args) {
    return spawn('git', args, {
      cwd: deployDir,
      verbose: verbose,
      stdio: 'inherit'
    });
  }

  function setup() {
    const userName = args.name || args.user || args.userName || '';
    const userEmail = args.email || args.userEmail || '';

    // Create a placeholder for the first commit
    return fs.writeFile(pathFn.join(deployDir, 'placeholder'), '').then(() => {
      return git('init');
    }).then(() => {
      return userName && git('config', 'user.name', userName);
    }).then(() => {
      return userEmail && git('config', 'user.email', userEmail);
    }).then(() => {
      return git('add', '-A');
    }).then(() => {
      return git('commit', '-m', 'First commit');
    });
  }

  function push(repo) {
    return git('add', '-A').then(() => {
      return git('commit', '-m', message).catch(() => {
        // Do nothing. It's OK if nothing to commit.
      });
    }).then(() => {
      return git('push', '-u', repo.url, 'HEAD:' + repo.branch, '--force');
    });
  }

  return fs.exists(deployDir).then(exist => {
    if (exist) return;

    log.info('Setting up Git deployment...');
    return setup();
  }).then(() => {
    log.info('Clearing .deploy_git folder...');
    return fs.emptyDir(deployDir);
  }).then(() => {
    const opts = {};
    log.info('Copying files from public folder...');
    if (typeof ignoreHidden === 'object') {
      opts.ignoreHidden = ignoreHidden.public;
    } else {
      opts.ignoreHidden = ignoreHidden;
    }

    if (typeof ignorePattern === 'string') {
      opts.ignorePattern = new RegExp(ignorePattern);
    } else if (typeof ignorePattern === 'object' && Reflect.apply(Object.prototype.hasOwnProperty, ignorePattern, ['public'])) {
      opts.ignorePattern = new RegExp(ignorePattern.public);
    }

    return fs.copyDir(publicDir, deployDir, opts);
  }).then(() => {
    log.info('Copying files from extend dirs...');

    if (!extendDirs) {
      return;
    }

    if (typeof extendDirs === 'string') {
      extendDirs = [extendDirs];
    }

    const mapFn = function(dir) {
      const opts = {};
      const extendPath = pathFn.join(baseDir, dir);
      const extendDist = pathFn.join(deployDir, dir);

      if (typeof ignoreHidden === 'object') {
        opts.ignoreHidden = ignoreHidden[dir];
      } else {
        opts.ignoreHidden = ignoreHidden;
      }

      if (typeof ignorePattern === 'string') {
        opts.ignorePattern = new RegExp(ignorePattern);
      } else if (typeof ignorePattern === 'object' && Reflect.apply(Object.prototype.hasOwnProperty, ignorePattern, [dir])) {
        opts.ignorePattern = new RegExp(ignorePattern[dir]);
      }

      return fs.copyDir(extendPath, extendDist, opts);
    };

    return Promise.map(extendDirs, mapFn, {
      concurrency: 2
    });
  }).then(() => {
    return parseConfig(args);
  }).each(repo => {
    return push(repo);
  });
};

function commitMessage(args) {
  const message = args.m || args.msg || args.message || 'Site updated: {{ now("yyyy-MM-dd HH:mm:ss") }}';
  return nunjucks.renderString(message, swigHelpers);
}
