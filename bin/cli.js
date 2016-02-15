#! /usr/bin/env node

var program = require('commander'),
    exec = require('child_process').exec,
    debug = require('debug')('cli'),
    p = require('../package.json'),
    version = p.version.split('.').shift(),
    conf = {};

program
  .version(version)
  .option('-f, --file', 'Specify a .env file which includes environment vars to load.')
  .option('-v, --verbose', 'Output warnings.')
  .option('-p, --pubsub', 'Start local PubSub Server as well.')
  .parse(process.argv);

if (program.file) {
    conf.path = file;
}

if (!program.verbose) {
    conf.silent = true;
}

if (program.pubsub) {
    debug('Starting pubsub server...');
    ps = require('openframe-pubsubserver');
    ps.start();
}

// load env vars from a .env file
require('dotenv').config(conf);

var server = require('../server/server');

server.start();