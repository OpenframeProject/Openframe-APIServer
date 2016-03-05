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
        if (!_currentFrameId && frames.length) {
            setCurrentFrameById(frames[0].id);
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
            return frame.id === frameId;
        });
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

    return {
        getFramesList: getFramesList,
        setFramesList: setFramesList,
        findFrameById: findFrameById,
        setCurrentFrameById: setCurrentFrameById,
        getCurrentFrame: getCurrentFrame,
        getCurrentArtwork: getCurrentArtwork
    };
})(OF);
