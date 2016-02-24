window.OF = (function($) {

    /**
     * Login
     * @param  {String} username
     * @param  {String} password
     * @return {Promise}
     */
    function login(username, password) {
        var creds = {
            username: username,
            password: password
        };
        return $.post('/api/users/login', creds);
    }

    /**
     * Fetch the current user.
     * @param  {Boolean} includeCollections Should the response include the user's collections?
     * @return {Promise}
     */
    function fetchUser(includeCollections) {
        console.log('fetchUser', includeCollections);
        var filter = {};
        // if (includeCollections) {
        //     filter = {
        //         'filter': {
        //             'include': [
        //                 {
        //                     collections: {
        //                         relation: 'artwork',
        //                         scope: {
        //                             order: 'created DESC'
        //                         }
        //                     }
        //                 }
        //             ]
        //         }
        //     };
        // }
        if (includeCollections) {
            filter = {
                'filter': {
                    'include': ['collections']
                }
            };
        }
        return $.get('/api/users/current', filter);
    }

    /**
     * Fetch a collection
     * @param  {String} id Collection id (optional, defaults to primary collection)
     */
    function fetchCollection(id) {
        id = id || 'primary';
        return $.get('/api/users/current/collections/' + id, {
            'filter': {
                'include': [
                    'artwork'
                ]
            }
        });
    }

    /**
     * Fetch the stream
     * @param  {Number} skip
     * @param  {Number} limit
     * @return {Promise}
     */
    function fetchStream(skip, limit) {
        skip = skip || 0;
        limit = limit || 25;
        return $.get('/api/artwork/stream', {
            filter: {
                skip: skip,
                limit: limit
            }
        });
    }

    /**
     * Get the current user's frame.
     * @return {[type]} [description]
     */
    function fetchFrames() {
        return $.get('/api/users/current/all_frames');
    }

    /**
     * Push an artwork to a frame.
     * @param  {String} frameId
     * @param  {Object} artworkData An artwork description object
     * @return {Promise}
     */
    function pushArtwork(frameId, artworkData) {
        return $.ajax({
            url: '/api/frames/' + frameId + '/current_artwork',
            method: 'PUT',
            data: artworkData
        });
    }

    /**
     * Add a new artwork to primary collection
     * {
     *   "title": "string",
     *   "description": "string",
     *   "is_public": true,
     *   "url": "string",
     *   "thumb_url": "string",
     *   "author_name": "string",
     *   "plugins": {},
     *   "format": "string"
     * }
     * @param  {Object} artworkData An artwork description object
     */
    function addArtwork(artwork) {
        return $.post('/api/users/current/collections/primary/artwork', artwork);
    }

    /**
     * Update an artwork object
     * @param  {String} artworkId
     * @param  {Object} artworkData
     * @return {Promise}
     */
    function updateArtwork(artworkId, artworkData) {
        console.log(artworkData);
        if (artworkData.hasOwnProperty('is_public')) {
            artworkData.is_public = (artworkData.is_public === 'true' || artworkData.is_public === true);
        }
        return $.ajax({
            url: '/api/artwork/' + artworkId,
            method: 'PUT',
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(artworkData)
        });
    }

    function addArtworkToCollection(artworkId, collectionId) {
        var url = '/api/artwork/' + artworkId + '/collections/rel/' + collectionId;
        return $.ajax({
            url: url,
            method: 'PUT',
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8'
        });
    }

    function deleteArtwork(artworkId) {
        var url = '/api/artwork/' + artworkId;
        return $.ajax({
            url: url,
            method: 'DELETE'
        });
    }

    return {
        login: login,
        fetchFrames: fetchFrames,
        fetchStream: fetchStream,
        fetchUser: fetchUser,
        fetchCollection: fetchCollection,
        pushArtwork: pushArtwork,
        addArtwork: addArtwork,
        updateArtwork: updateArtwork,
        addArtworkToCollection: addArtworkToCollection,
        deleteArtwork: deleteArtwork
    };

})(jQuery);
