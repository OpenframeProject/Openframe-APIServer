var log = require('./logger.js').log;

module.exports = (function() {
    var responseObj = {};

    /**
     * Appends the items to the supplied property on the responseObj,
     * hiding the hidden fields via the object's toJSON method.
     * @param  {[type]} items  An array of models to be included in the response
     * @param  {[type]} hidden A comma-delimitted string which contains the fields that should be removed from the response
     * @param  {[type]} property  The property to which the array of models will be attached
     * @return {[type]} a reference to this builder object
     */
    function _buildResponse(items, hidden, property, extras) {
        log.debug('_buildResponse', property);
        // reset response obj
        responseObj = {};

        var itemObjs = [];
        items.forEach(function(item) {
            if (hidden !== null) {
                // document object that can be transformed 
                var itemObj = item.toJSON({
                    hide: hidden,
                    transform: true
                });

            } else {
                // array of objects that just need fields removed
                item._id = undefined;
                item.__v = undefined;
                item._deleted = undefined;
                var itemObj = item;
            }

            itemObjs.push(itemObj);
        });

        responseObj[property] = itemObjs;

        if (extras) {
            _addExtras(extras);
        }

        return this;
    }

    /**
     * Add extra properties to the response object
     * @param {[type]} extras The object who's props will be included in the response
     */
    function _addExtras(extras) {
        (Object.keys(extras)).forEach(function(extra) {
            responseObj[extra] = extras[extra];
        });
        return this;
    }

    return {
        addExtras: _addExtras,
        buildResponse: _buildResponse,
        toObject: function() {
            return responseObj;
        }
    };
})();
