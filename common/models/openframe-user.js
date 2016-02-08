var loopback = require('loopback');

module.exports = function(OpenframeUser) {

    /**
     * Override toJSON in order to display email address only for the logged-in user.
     *
     * @return {Object} Plain JS Object which will be transformed to JSON for output.
     */
    // OpenframeUser.prototype.toJSON = function() {
    //     console.log(loopback.getCurrentContext());
    //     var obj = this.toObject(false, true, false);
    //     // var accessToken = loopback.getCurrentContext().active.accessToken,
    //     //     obj = this.toObject(false, true, false);

    //     // if this isn't the currently logged in user, don't display email address
    //     // if (!accessToken || this.id !== accessToken.userId) {
    //     //     delete obj.email;
    //     // }

    //     return obj;
    // }
};
