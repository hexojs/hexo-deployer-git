# hexo-deployer-git

[![NPM version](https://badge.fury.io/js/hexo-deployer-git.svg)](http://badge.fury.io/js/hexo-deployer-git)

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
  
# or this:
deploy:
  type: git
  message: [message]
  repo: 
    github: <repository url>,[branch]
```

- **repo**: Repository URL
- **branch**: Git branch
- **message**: Commit message. The default commit message is `Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}`.

## License

MIT

[Hexo]: http://hexo.io/