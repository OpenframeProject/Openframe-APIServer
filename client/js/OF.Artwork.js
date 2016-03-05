/**
 * Super basic wrapper on artwork list
 */
window.OF.Artwork = (function(OF) {
    var _artworkList = [],
        _pagination = {
            skip: 0,
            limit: 25
        };

    /**
     * Get the artwork list.
     * @return {Array} An array of Artwork model objects.
     */
    function getArtworkList() {
        return _artworkList;
    }

    /**
     * Add artworks to the _artworkList
     * @param  {Array|Object} artwork array or object to add
     */
    function _appendToArtworkList(artwork) {
        if (_.isArray(artwork)) {
            _artworkList = _artworkList.concat(artwork);
        } else if (_.isPlainObject(artwork)) {
            _artworkList.push(artwork);
        }
        return _artworkList;
    }

    /**
     * Add artworks to the _artworkList
     * @param  {Array|Object} artwork array or object to add
     */
    function _prependToArtworkList(artwork) {
        if (_.isArray(artwork)) {
            _artworkList = artwork.concat(_artworkList);
        } else if (_.isPlainObject(artwork)) {
            _artworkList.unshift(artwork);
        }
        return _artworkList;
    }

    function loadNextPage() {
        _pagination.skip += _pagination.limit;
        return loadArtwork(_pagination.skip);
    }

    /**
     * Load a page of Artwork objects from the server and render them.
     * @param  {Number} skip
     */
    function loadArtwork(skip) {
        skip = skip || 0;
        var dfd = $.Deferred();

        switch (window.PATH) {
            case '/stream':
                OF.API.fetchStream(skip, _pagination.limit).then(function(stream) {
                    _appendToArtworkList(stream.artwork);
                    dfd.resolve(stream.artwork);
                });
                break;
            case '/' + window.USERNAME:
                OF.API.fetchCollection(skip, _pagination.limit).then(function(data) {
                    _appendToArtworkList(data.collection.artwork);
                    dfd.resolve(data.collection.artwork);
                });
                break;
            default:
        }

        return dfd;
    }

    /**
     * Find an artwork in the current collection by artworkId
     * @param  {String} artworkId
     * @return {Object}
     */
    function findArtworkById(artworkId) {
        return _.find(_artworkList, function(artwork) {
            return artwork.id === artworkId;
        });
    }

    function getArtworkViewModel(artwork, plugins) {
        var art = _.extend({}, artwork),
            currentFrame = OF.Frames.getCurrentFrame(),
            currentArtwork = OF.Frames.getCurrentArtwork();
        _addFormatDisplayName(art);
        art.disabled = currentFrame && currentFrame.plugins && plugins.hasOwnProperty(art.format) ? 'btn-push--enabled' : 'btn-push--disabled';
        art.liked = art.liked || false;
        art.currentArtworkId = currentArtwork ? currentArtwork.id : null;
        return art;
    }

    /**
     * add more human-friendly names for the standard three plugins
     * @param {Object} artwork
     */
    function _addFormatDisplayName(artwork) {
        switch (artwork.format) {
            case 'openframe-glslviewer':
                artwork.formatDisplayName = 'shader';
                break;
            case 'openframe-image':
                artwork.formatDisplayName = 'image';
                break;
            case 'openframe-website':
                artwork.formatDisplayName = 'website';
                break;
            default:
                artwork.formatDisplayName = artwork.format;
        }
    }

    return {
        getArtworkList: getArtworkList,
        findArtworkById: findArtworkById,
        getArtworkViewModel: getArtworkViewModel,
        loadNextPage: loadNextPage,
        loadArtwork: loadArtwork
    };
})(OF);
