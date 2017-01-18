#! /usr/bin/env node
require('cls-hooked');

var program = require('commander'),
    debug = require('debug')('openframe:apiserver:cli'),
    p = require('../package.json'),
    version = p.version.split('.').shift(),
    conf = {};

program
  .version(version)
  .option('-f, --file [file]', 'Specify a .env file which includes environment vars to load.')
  .option('-v, --verbose', 'Output warnings.')
  .option('-p, --pubsub', 'Start local PubSub Server as well.')
  .parse(process.argv);

if (program.file) {
    conf.path = program.file;
}

if (!program.verbose) {
    conf.silent = true;
}

// load env vars from a .env file
require('dotenv').config(conf);

if (program.pubsub) {
    debug('Starting pubsub server...');
    require('openframe-pubsubserver').start();
}

require('../server/server').start();
