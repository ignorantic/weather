'use strict';

var util = require('util');

module.exports = {
  src: 'dev/img/sprite/**/*.{png,gif,jpg}',
  destImage: 'build/img/sprite.png',
  destCSS: 'dev/sass/_sprite.sass',
  imgPath: '../img/sprite.png',
  padding: 0,
  algorithm: 'left-right',
  algorithmOpts: { sort: false }
};