# hexo-deployer-git

[![Build Status](https://travis-ci.org/hexojs/hexo-deployer-git.svg?branch=master)](https://travis-ci.org/hexojs/hexo-deployer-git)  [![NPM version](https://badge.fury.io/js/hexo-deployer-git.svg)](http://badge.fury.io/js/hexo-deployer-git) [![Coverage Status](https://img.shields.io/coveralls/hexojs/hexo-deployer-git.svg)](https://coveralls.io/r/hexojs/hexo-deployer-git?branch=master) [![Build status](https://ci.appveyor.com/api/projects/status/liqy4nib33ht70so/branch/master?svg=true)](https://ci.appveyor.com/project/tommy351/hexo-deployer-git/branch/master)

Git deployer plugin for [Hexo].

## Installation

``` bash
$ npm install hexo-deployer-git --save
```

## Options

You can configure this plugin in `_config.yml`.

``` yaml
# You can use this:
deploy:
  type: git
  repo: <repository url>
  branch: [branch]
  message: [message]
  name: [git user]
  email: [git email]
  
# or this:
deploy:
  type: git
  message: [message]
  repo: 
    github: <repository url>,[branch]
    gitcafe: <repository url>,[branch]
```

- **repo**: Repository URL
- **branch**: Git branch to deploy the static site to
- **message**: Commit message. The default commit message is `Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}`.
- **name** and **email**: User info for committing the change, overrides global config. This info is independent of git login.

## How it works

`hexo-deployer-git` works by generating the site in `.deploy_git` and *force pushing* to the repo(es) in config.  
If `.deploy_git` does not exist, a repo will initialized (`git init`).  
Otherwise the curent repo (with its commit history) will be used.  

Users can to clone the deployed repo to `.deploy_git` to keep the commit history.
```
git clone <gh-pages repo> .deploy_git
```

## Reset

Remove `.deploy_git` folder.

``` bash
$ rm -rf .deploy_git
```

## License

MIT

[Hexo]: http://hexo.io/
