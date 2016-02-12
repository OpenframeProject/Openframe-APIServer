var loopback = require('loopback'),
    disableAllMethods = require('../../helpers').disableAllMethods;

module.exports = function(OpenframeUser) {
    // disableAllMethods(OpenframeUser, [
    //     'find',
    //     'findById',
    //     'findOne',
    //     'create',
    //     'upsert',
    //     'updateAttributes',
    //     'deleteById',
    //     'updateAll',
    //     'count',
    //     'login',

    //     '__get__owned_frames',
    //     '__findById__owned_frames',
    //     '__destroyById__owned_frames',
    //     '__updateById__owned_frames',
    //     '__create__owned_frames',
    //     '__delete__owned_frames',
    //     '__count__owned_frames',

    //     '__get__managed_frames',
    //     '__findById__managed_frames',
    //     '__destroyById__managed_frames',
    //     '__updateById__managed_frames',
    //     '__create__managed_frames',
    //     '__delete__managed_frames',
    //     '__count__managed_frames',

    //     '__get__owned_artwork',
    //     '__findById__owned_artwork',
    //     '__destroyById__owned_artwork',
    //     '__updateById__owned_artwork',
    //     '__create__owned_artwork',
    //     '__delete__owned_artwork',
    //     '__count__owned_artwork',

    //     '__get__authored_artwork',
    //     '__findById__authored_artwork',
    //     '__destroyById__authored_artwork',
    //     '__updateById__authored_artwork',
    //     '__create__authored_artwork',
    //     '__delete__authored_artwork',
    //     '__count__authored_artwork',

    //     '__get__collections',
    //     '__create__collections',
    //     '__delete__collections',
    //     '__count__collections'
    // ]);
    // OpenframeUser.disableRemoteMethod('create', true); // Removes (POST) /products
    // OpenframeUser.disableRemoteMethod('upsert', true); // Removes (PUT) /products
    // OpenframeUser.disableRemoteMethod('deleteById', true); // Removes (DELETE) /products/:id
    // OpenframeUser.disableRemoteMethod("updateAll", true); // Removes (POST) /products/update
    // OpenframeUser.disableRemoteMethod("__get__openframe_user_credentials", true); // Removes (PUT) /products/:id
    // OpenframeUser.disableRemoteMethod('createChangeStream', true); // removes (GET|POST) /products/change-stream

    // Maybe a custom method to get the main (i.e. first) collection?
    // OpenframeUser.prototype.mainCollection = function() {

    // }


    /**
     * Override toJSON in order to display email address only for the logged-in user.
     *
     * @return {Object} Plain JS Object which will be transformed to JSON for output.
     */
    OpenframeUser.prototype.toJSON = function() {
        // TODO: this seems awfully fragile... not very clear when context is available
        var ctx = loopback.getCurrentContext(),
            req = ctx && ctx.active ? ctx.active.http.req : null,
            user = req ? req.user : null,
            obj = this.toObject(false, true, false);

        // if this isn't the currently logged in user, don't display email address
        if (!user || this.id !== user.id) {
            delete obj.email;
        }

        return obj;
    }
};

