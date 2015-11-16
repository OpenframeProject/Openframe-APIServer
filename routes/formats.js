'use strict';

var restifyMongoose = require('restify-mongoose'),
    FormatModel = require('../domain/model/format'),
    // the restify-mongoose model to endpoint mappings
    formatMappings = restifyMongoose(FormatModel);

module.exports = function(server, io) {

    // REST handlers

    server.get('/formats', formatMappings.query({
        outputFormat: 'json-api',
        modelName: 'formats'
    }));
    server.get('/formats/:id', formatMappings.detail());
    server.post('/formats', formatMappings.insert());
    // TODO: put and patch are synonomous at the moment...
    server.put('/formats/:id', formatMappings.update());
    server.patch('/formats/:id', formatMappings.update());
    server.del('/formats/:id', formatMappings.remove());

    // socket.io event handlers

    io.sockets.on('connection', function(socket) {
        socket.on('format::updated', function(data) {
            console.log(data);
        });
    });

};

