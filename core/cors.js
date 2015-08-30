var responses = require('./../view/responses.js'),
    log = require('./../core/logger.js').log;

/**
 * Handler for MethodNotAllowed, which occurs for preflight OPTIONS requests
 *
 * See https://github.com/mcavage/node-restify/issues/284
 */
function unknownMethodHandler(req, res) {
    // if this is indeed an OPTIONS request
    if (req.method.toLowerCase() === 'options') {
        log.info('Received an OPTIONS method request');

        var allowHeaders = [
            'Accept', 
            'Accept-Version', 
            'Content-Type', 
            'Api-Version', 
            'Origin', 
            'X-Requested-With', 
            'Authorization'
        ];

        if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
        res.header('Access-Control-Allow-Methods', res.methods.join(', '));
        res.header('Access-Control-Allow-Origin', req.headers.origin);

        return res.send(204);
    } else {
        // Otherwise, respond accordingly
        return responses.apiNotAllowed(res);
    }
}

module.exports = unknownMethodHandler;
