module.exports = function(app) {
    var Role = app.models.Role;
    Role.registerResolver('$frameManager', function(role, context, cb) {
        console.log(context.modelName);
        cb(null, true);

        // function reject(err) {
        //     if (err) {
        //         return cb(err);
        //     }
        //     cb(null, false);
        // }

        // if (context.modelName !== 'OpenframeUser') {
        //     // the target model is not an OpenframeUser
        //     return reject();
        // }

        // var userId = context.accessToken.userId;
        // if (!userId) {
        //     return reject(); // do not allow anonymous users
        // }

        // // check if the current user is a manager of this frame
        // var Frame = app.models.Frame;
        // Frame.users.findById(userId, function(err, user) {
        //     if (err) {
        //         return reject(err);
        //     }
        //     cb(null, true);
        // });

        // // check if
        // context.model.findById(context.modelId, function(err, of_user) {
        //     if (err || !of_user) {
        //         reject(err);
        //     }

        //     OpenframeUser.count({
        //         ownerId: project.ownerId,
        //         memberId: userId
        //     }, function(err, count) {
        //         if (err) {
        //             return reject(err);
        //         }
        //         cb(null, count > 0); // true = is a team member
        //     });
        // });
    });
};

