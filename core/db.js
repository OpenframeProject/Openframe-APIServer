// dependancies
var mongoose = require('mongoose');

// local deps
var log = require('./logger').log;
var conf = require('./../config/db/db_config');

// db
var connect = function() {
    mongoose.connect(conf.uri, conf.options);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection err:'));
    db.once('open', function() {
        log.info('Connected To Mongo Database at ' + conf.uri);
    });

    return db;
};

exports.connect = connect;
