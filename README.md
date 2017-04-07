# hexo-deployer-git

[![Backers on Open Collective](https://opencollective.com/hexo-deployer-git/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/hexo-deployer-git/sponsors/badge.svg)](#sponsors)
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
  extend_dirs: [extend directory]
  ignore_hidden: false # default is true

# or this:
deploy:
  type: git
  message: [message]
  repo:
    github: <repository url>,[branch]
    coding: <repository url>,[branch]
  extend_dirs:
    - [extend directory]
    - [another extend directory]
  ignore_hidden:
    public: false
    [extend directory]: true
    [another extend directory]: false
```

- **repo**: Repository URL
- **branch**: Git branch to deploy the static site to
- **message**: Commit message. The default commit message is `Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}`.
- **name** and **email**: User info for committing the change, overrides global config. This info is independent of git login.
- **extend_dirs**: Add some extensions directory to publish. e.g `demo`, `examples`
- **ignore_hidden** (Boolean|Object): whether ignore hidden files to publish. the github requires the `.nojekyll` in root.
  * Boolean: for all dirs.
  * Object: for public dir and extend dir:
    * `public`: the public dir defaults.
    * [extend directory]

## How it works

`hexo-deployer-git` works by generating the site in `.deploy_git` and *force pushing* to the repo(es) in config.
If `.deploy_git` does not exist, a repo will initialized (`git init`).
Otherwise the curent repo (with its commit history) will be used.

Users can clone the deployed repo to `.deploy_git` to keep the commit history.
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


## Backers

Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/hexo-deployer-git#backer)]

<a href="https://opencollective.com/hexo-deployer-git/backer/0/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/1/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/2/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/3/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/4/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/5/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/6/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/7/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/8/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/9/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/10/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/11/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/12/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/13/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/14/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/15/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/16/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/17/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/18/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/19/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/20/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/21/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/22/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/23/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/24/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/25/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/26/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/27/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/28/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/backer/29/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/backer/29/avatar.svg"></a>


## Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/hexo-deployer-git#sponsor)]

<a href="https://opencollective.com/hexo-deployer-git/sponsor/0/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/1/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/2/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/3/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/4/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/5/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/6/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/7/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/8/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/9/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/10/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/11/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/12/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/13/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/14/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/15/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/16/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/17/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/18/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/19/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/20/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/21/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/22/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/23/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/24/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/25/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/26/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/27/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/28/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/hexo-deployer-git/sponsor/29/website" target="_blank"><img src="https://opencollective.com/hexo-deployer-git/sponsor/29/avatar.svg"></a>

