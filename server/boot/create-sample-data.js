var debug = require('debug')('openframe:apiserver:sample-data');

module.exports = function(app) {
    if (process.env.LB_DB_DS_NAME) {
        return;
    }
    var dataSource = 'memoryDb';
    app.dataSources[dataSource].automigrate('Artwork', function(err) {
        if (err) throw err;

        // WIPE DATA ON APP START
        // !!! FOR TESTING ONLY !!!
        wipeData()
            .then(function(info) {
                debug('wiped!', info);

                Promise.all([
                    createOpenframeUsers(),
                    createArtwork(),
                    createFrames()
                ])
                .then(formRelationships)
                .catch(function(err) {
                    debug('ERROR!', err);
                });
            });



        function wipeData() {
            debug('wipeData');
            var usersWipe = new Promise(function(resolve, reject) {
                app.models.OpenframeUser.destroyAll(function(err, info) {
                    if (err) reject(err);
                    resolve(info);
                });
            });
            var artworkWipe = new Promise(function(resolve, reject) {
                app.models.Artwork.destroyAll(function(err, info) {
                    if (err) reject(err);
                    resolve(info);
                });
            });
            var framesWipe = new Promise(function(resolve, reject) {
                app.models.Frame.destroyAll(function(err, info) {
                    if (err) reject(err);
                    resolve(info);
                });
            });

            return Promise.all([usersWipe, artworkWipe, framesWipe]);
        }

        function createOpenframeUsers() {
            return new Promise(function(resolve, reject) {
                app.models.OpenframeUser.create([{
                    username: 'slewitt',
                    email: 'slewitt@openframe.io',
                    password: 'asdf',
                    full_name: 'Sol Lewitt',
                    emailVerified: true,
                    settings: {
                        enable_notifications: true
                    }
                }, {
                    username: 'ppan',
                    email: 'ppan@openframe.io',
                    password: 'asdf',
                    full_name: 'Peter Pan',
                    emailVerified: true,
                    settings: {
                        enable_notifications: false
                    }
                }, {
                    username: 'melliot',
                    email: 'melliot@openframe.io',
                    password: 'asdf',
                    full_name: 'Missy Elliot',
                    emailVerified: true,
                    settings: {
                        enable_notifications: true
                    }
                }, ], function(err, users) {
                    if (err) reject(err);
                    debug('Users created');
                    resolve(users);
                });
            });
        }

        function createFrames() {
            return new Promise(function(resolve, reject) {
                app.models.Frame.create([{
                    name: 'Frame A',
                    settings: {}
                }, {
                    name: 'Frame B',
                    settings: {}
                }, {
                    name: 'Frame C',
                    settings: {}
                }, ], function(err, frames) {
                    if (err) reject(err);
                    debug('Frames created');
                    resolve(frames);
                });
            });
        }

        function createArtwork() {
            return new Promise(function(resolve, reject) {
                app.models.Artwork.create([{
                    title: 'Example Image',
                    author_name: 'Ima Geofit',
                    is_public: true,
                    url: 'http://www.codex99.com/cartography/images/everest/everest_imhof_lg.jpg',
                    thumb_url: 'http://www.codex99.com/cartography/images/everest/everest_imhof_lg.jpg',
                    plugins: {
                        'openframe-image': 'git+https://git@github.com/OpenframeProject/Openframe-Image.git'
                    },
                    format: 'openframe-image',
                    'ownerId': 1
                }, {
                    title: 'Example Shader',
                    author_name: 'Slim Shady',
                    is_public: true,
                    url: 'http://jonathanwohl.com/test.frag',
                    thumb_url: 'http://jonathanwohl.com/shader-thumb.png',
                    plugins: {
                        'openframe-glslviewer': 'git+https://git@github.com/OpenframeProject/Openframe-glslViewer.git'
                    },
                    format: 'openframe-glslviewer',
                    'ownerId': 2
                }, {
                    title: 'Example Website',
                    author_name: 'Webster McBride',
                    is_public: true,
                    url: 'http://www.flyingfrying.com/',
                    thumb_url: 'http://jonathanwohl.com/frying-egg.png',
                    plugins: {
                        'openframe-website': 'git+https://git@github.com/OpenframeProject/Openframe-Website.git'
                    },
                    format: 'openframe-website',
                    'ownerId': 3
                }, ], function(err, artwork) {
                    if (err) reject(err);
                    debug('Artworks created');
                    resolve(artwork);
                });
            });
        }

        function formRelationships(values) {
            debug('formRelationships', values);
            var users = values[0],
                artworks = values[1],
                frames = values[2];

            // create a collection for each user, add all
            // artwork to each
            users.forEach(function(user) {
                // all users can manage frame id:2 (idx 1)
                user.managed_frames.add(frames[1]);


                user.collections.create({
                    name: 'Main Collection'
                }, function(err, collection) {
                    debug('user.collection(): ', user.collections());
                    collection.artwork.add(artworks[0]);
                    collection.artwork.add(artworks[1]);
                    collection.artwork.add(artworks[2]);
                    collection.current_artwork(artworks[0]);
                    collection.save();
                });
            });

            // add an 'owner' user to each frame
            frames.forEach(function(frame, idx) {
                // each user owns one frame
                frame.owner(users[idx]);
                frame.save();
            });
        }


    });
};
