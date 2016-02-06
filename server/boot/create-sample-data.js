module.exports = function(app) {
    app.dataSources.memoryDb.automigrate('Artwork', function(err) {
        if (err) throw err;

        // WIPE DATA ON APP START
        // !!! FOR TESTING ONLY !!!
        wipeData()
            .then(function(info) {
                console.log('wiped!', info);

                Promise.all([
                        createOpenframeUsers(),
                        createArtwork(),
                        createFrames()
                    ])
                    .then(formRelationships)
                    .catch(function(err) {
                        console.log('ERROR!', err);
                    });
            });



        function wipeData() {
            console.log('wipeData');
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
                    username: 'jon',
                    email: 'jon@openframe.io',
                    password: 'asdf',
                    full_name: 'Jonathan Wohl'
                }, {
                    username: 'ishac',
                    email: 'ishac@openframe.io',
                    password: 'asdf',
                    full_name: 'Ishac Bertran'
                }, {
                    username: 'nancy',
                    email: 'nancy@openframe.io',
                    password: 'asdf',
                    full_name: 'Nancy Mishnokov'
                }, ], function(err, users) {
                    if (err) reject(err);
                    console.log('Users created');
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
                    console.log('Frames created');
                    resolve(frames);
                });
            });
        }

        function createArtwork() {
            return new Promise(function(resolve, reject) {
                app.models.Artwork.create([{
                    title: 'Example Image',
                    is_public: true,
                    url: 'http://www.codex99.com/cartography/images/everest/everest_imhof_lg.jpg',
                    plugins: {
                        'openframe-image': 'git+https://git@github.com/OpenframeProject/Openframe-Image.git'
                    },
                    format: 'openframe-image'
                }, {
                    title: 'Example Shader',
                    is_public: true,
                    url: 'http://jonathanwohl.com/test.frag',
                    plugins: {
                        'openframe-glslviewer': 'git+https://git@github.com/OpenframeProject/Openframe-glslViewer.git'
                    },
                    format: 'openframe-glslviewer'
                }, {
                    title: 'Example Website',
                    is_public: true,
                    url: 'http://www.flyingfrying.com/',
                    plugins: {
                        'openframe-website': 'git+https://git@github.com/OpenframeProject/Openframe-Website.git'
                    },
                    format: 'openframe-website'
                }, ], function(err, artwork) {
                    if (err) reject(err);
                    console.log('Artworks created');
                    resolve(artwork);
                });
            });
        }

        function formRelationships(values) {
            console.log('formRelationships', values);
            var users = values[0],
                artworks = values[1],
                frames = values[2];

            // create a collection for each user, add all
            // artwork to each
            users.forEach(function(user) {
                user.collections.create({
                    name: 'Main Collection'
                }, function(err, collection) {
                    console.log('user.collection(): ', user.collections());
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

                // all users are 'managers' of all frames
                frame.managers.add(users[0]);
                frame.managers.add(users[1]);
                frame.managers.add(users[2]);
                frame.save();
            });
        }


    });
};

