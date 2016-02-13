/* global hexo */
'use strict';

hexo.extend.deployer.register('git', require('./lib/deployer'));
