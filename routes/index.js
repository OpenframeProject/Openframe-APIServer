/*jslint node: true, stupid: true */
'use strict';
var fs = require('fs');

// require('./artwork');
// require('./users');
// require('./frames');

module.exports = function (server, io) {
  fs.readdirSync('./routes').forEach(function (file) {
    if (file.substr(-3, 3) === '.js' && file !== 'index.js') {
      require('./' + file.replace('.js', ''))(server, io);
    }
  });
};

