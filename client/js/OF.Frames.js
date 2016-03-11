/**
 * Wrapper on frames list
 */
window.OF.Frames = (function(OF) {
    var _framesList = [],
        _currentFrameId = localStorage._currentFrameId || null;

    /**
     * Get the list of available frames
     * @return {Array}
     */
    function getFramesList() {
        return _framesList;
    }

    /**
     * Set the list of available frames.
     * @param {Array} An array of frame model objects
     */
    function setFramesList(frames) {
        _framesList = frames;

        // if no current frame is set, set the first frame as current
        if (!getCurrentFrame() && _framesList.length) {
            setCurrentFrameById(_framesList[0].id);
        }

        return _framesList;
    }

    /**
     * Find a frame by ID
     * @param  {String} frameId
     * @return {Object} A Frame model object
     */
    function findFrameById(frameId) {
        return _.find(_framesList, function(frame) {
            return frame.id.toString() === frameId.toString();
        });
    }

    /**
     * Update a frame model by id. Replaces the in-memory frame with
     * the object passed in data param.
     * @param  {String} frameId
     * @param  {Object} data
     * @return {Boolean} true if updated, false if not found
     */
    function updateFrameById(frameId, data) {
        var idx = _.findIndex(_framesList, function(frame) {
            return frame.id.toString() === frameId.toString();
        });
        if (idx !== -1) {
            _framesList[idx] = data;
            return true;
        }
        return false;
    }

    /**
     * Remove a frame from frame list by id.
     *
     * @param  {String} frameId
     * @return {Boolean} true if removed, false if not found
     */
    function removeFrameById(frameId) {
        var idx = _.findIndex(_framesList, function(frame) {
            return frame.id.toString() === frameId.toString();
        });
        if (idx !== -1) {
            _framesList.splice(idx, 1);
            if (frameId.toString() === _currentFrameId.toString()) {
                // frame was current frame, promote the next top frame in list
                if (_framesList.length) {
                    setCurrentFrameById(_framesList[0].id);
                }
            }
            return true;
        }
        return false;
    }

    /**
     * Set the current frame, and save in local storage
     * @param {String} frameId
     */
    function setCurrentFrameById(frameId) {
        _currentFrameId = localStorage._currentFrameId = frameId;
    }

    /**
     * Get the currently selected frame.
     * @return {Object} A Frame model
     */
    function getCurrentFrame() {
        if (!_currentFrameId) return null;
        return findFrameById(_currentFrameId);
    }

    /**
     * Get the current artwork from the current frame
     * @return {[type]} [description]
     */
    function getCurrentArtwork() {
        var currentFrame = getCurrentFrame();
        if (!currentFrame || !currentFrame._current_artwork) return null;
        return currentFrame._current_artwork;
    }

    /**
     * Get a presentation-ready copy of the model data for a frame.
     * @param  {Object} frame
     * @return {Object} Modified frame ready for template
     */
    function getFrameViewModel(frame) {
        var theFrame = _.extend({}, frame);
        theFrame._current_artwork = theFrame._current_artwork || null;
        theFrame.isCurrent = theFrame.id.toString() === _currentFrameId.toString();
        theFrame.isOwner = theFrame.ownerId && theFrame.ownerId.toString() === window.USER_ID.toString();
        theFrame.connected = theFrame.connected || false;
        return theFrame;
    }

    function getCurrentFrameViewModel() {
        var frame = getCurrentFrame();
        return getFrameViewModel(frame);
    }

    function setupFrameSubscriptions(frameId) {
        console.log(frameId);
        OF.PubSub.client.subscribe('/frame/' + frameId + '/connected', function(data) {
            console.log('frame connected!', data);
            OF.DOM.updateFrames();
        });
        OF.PubSub.client.subscribe('/frame/' + frameId + '/disconnected', function(data) {
            console.log('frame disconnected!', data);
            OF.DOM.updateFrames();
        });
        OF.PubSub.client.subscribe('/frame/' + frameId + '/db_updated', function(data) {
            console.log('frame db_updated!', data);
            OF.DOM.updateFrames();
        });
        OF.PubSub.client.subscribe('/frame/' + frameId + '/updated', function(data) {
            console.log('frame updated!', data);
        });
        OF.PubSub.client.subscribe('/frame/' + frameId + '/updating', function(data) {
            console.log('frame updating!', data);
        });
    }

    return {
        getFramesList: getFramesList,
        setFramesList: setFramesList,
        findFrameById: findFrameById,
        setCurrentFrameById: setCurrentFrameById,
        getCurrentFrame: getCurrentFrame,
        getCurrentArtwork: getCurrentArtwork,
        getCurrentFrameViewModel: getCurrentFrameViewModel,
        getFrameViewModel: getFrameViewModel,
        updateFrameById: updateFrameById,
        removeFrameById: removeFrameById,
        setupFrameSubscriptions: setupFrameSubscriptions
    };
})(OF);
