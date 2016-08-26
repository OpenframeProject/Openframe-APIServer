var debug = require('debug')('openframe:apiserver:sample-data'),
    _ = require('lodash');

module.exports = function(app) {
    var dataSource = process.env.LOOPBACK_DATASOURCE_NAME || 'memoryDb';
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
                    createFrames(),
                    createChannels(),
                    createCollections()
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
                    full_name: 'Sol Lewitt'
                }, {
                    username: 'ppan',
                    email: 'ppan@openframe.io',
                    password: 'asdf',
                    full_name: 'Peter Pan',
                    website: 'http://ppan.com',
                    twitter: 'ppan',
                    bio: 'I\'m a young boy from neverland who flys with ferries and makes masterful digital artwork.'
                }, {
                    username: 'melliot',
                    email: 'melliot@openframe.io',
                    password: 'asdf',
                    full_name: 'Missy Elliot'
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
                    "name": "Frame A",
                    "settings": {},
                    "plugins": {
                      "openframe-image": "^0.1.0",
                      "openframe-glslviewer": "^0.1.0",
                      "openframe-website": "^0.1.0"
                    },
                    "formats": {},
                    "ownerId": 2,
                    "created": "2016-02-17T14:12:10.691Z",
                    "modified": "2016-02-17T14:12:10.691Z"
                  },
                  {
                    "name": "Frame B",
                    "settings": {},
                    "connected": true,
                    "plugins": {
                      "openframe-image": "^0.1.0",
                      "openframe-glslviewer": "^0.1.0",
                      "openframe-website": "^0.1.0"
                    },
                    "formats": {},
                    "ownerId": 2,
                    "created": "2016-02-17T14:12:10.694Z",
                    "modified": "2016-02-17T14:12:10.694Z",
                    "currentArtworkId": "4"
                  },
                  {
                    "name": "Frame C",
                    "settings": {},
                    "plugins": {
                      "openframe-image": "^0.1.0",
                      "openframe-glslviewer": "^0.1.0",
                      "openframe-website": "^0.1.0"
                    },
                    "formats": {},
                    "ownerId": 2,
                    "created": "2016-02-17T14:12:10.696Z",
                    "modified": "2016-02-17T14:12:10.696Z"
                  },
                  {
                    "name": "Frame D",
                    "connected": false,
                    "settings": {},
                    "plugins": {
                      "openframe-image": "^0.1.0",
                      "openframe-glslviewer": "^0.1.0",
                      "openframe-website": "^0.1.0"
                    },
                    "formats": {},
                    "ownerId": "56c47fba45e503657a51bebd",
                    "created": "2016-02-20T12:05:22.355Z",
                    "modified": "2016-02-20T12:05:22.355Z"
                  },
                  {
                    "name": "Frame E",
                    "connected": false,
                    "settings": {},
                    "plugins": {
                      "openframe-image": "^0.1.0",
                      "openframe-glslviewer": "^0.1.0",
                      "openframe-website": "^0.1.0"
                    },
                    "formats": {},
                    "ownerId": "56c47fba45e503657a51bebd",
                    "created": "2016-02-20T12:05:37.566Z",
                    "modified": "2016-02-20T12:05:37.566Z"
                  },
                  {
                    "name": "Frame F",
                    "connected": false,
                    "settings": {},
                    "plugins": {
                      "openframe-image": "^0.1.0",
                      "openframe-glslviewer": "^0.1.0"
                    },
                    "formats": {},
                    "ownerId": "56c47fba45e503657a51bebc",
                    "created": "2016-02-27T11:22:29.178Z",
                    "modified": "2016-02-27T11:22:29.178Z"
                  },
                  {
                    "name": "Frame G",
                    "connected": false,
                    "settings": {},
                    "plugins": {
                      "openframe-image": "^0.1.0",
                      "openframe-glslviewer": "^0.1.0"
                    },
                    "formats": {},
                    "ownerId": "56c47fba45e503657a51bebc",
                    "created": "2016-02-27T11:23:46.063Z",
                    "modified": "2016-02-27T11:23:46.063Z"
                  }], function(err, frames) {
                    if (err) reject(err);
                    debug('Frames created');
                    resolve(frames);
                });
            });
        }

        function createArtwork() {
            return new Promise(function(resolve, reject) {
                app.models.Artwork.create([{
                    "title": "pilogo",
                    "is_public": true,
                    "url": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Raspberry_Pi_Logo.svg/810px-Raspberry_Pi_Logo.svg.png",
                    "thumb_url": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Raspberry_Pi_Logo.svg/810px-Raspberry_Pi_Logo.svg.png",
                    "author_name": "ja",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "1",
                    "created": "2016-07-06T13:52:14.531Z",
                    "modified": "2016-07-06T13:52:14.530Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Generative Example",
                    "is_public": true,
                    "url": "http://wohllabs.com/GenerativeExample",
                    "thumb_url": "http://wohllabs.com/generative-example.png",
                    "author_name": "Andreas Müller",
                    "plugins": {},
                    "format": "openframe-of",
                    "ownerId": "1",
                    "created": "2016-06-30T23:36:08.677Z",
                    "modified": "2016-06-30T23:36:08.677Z",
                    "aspect_mode": "fill",
                    "resolution": "universal"
                  },
                  {
                    "title": "160624203526",
                    "is_public": false,
                    "url": "https://thebookofshaders.com/log/160630231115.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160630231115.png",
                    "author_name": "unknown",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "1",
                    "created": "2016-06-30T23:10:28.790Z",
                    "modified": "2016-06-30T23:10:28.790Z"
                  },
                  {
                    "title": "Distorded sphere",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160624205152.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160624205152.png",
                    "author_name": "Karim Naaji",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "2",
                    "created": "2016-06-24T20:51:10.386Z",
                    "modified": "2016-06-24T20:51:10.386Z",
                    "format_other": "",
                    "aspect_mode": "fill",
                    "resolution": "1280 x 720",
                    "description": "This piece explores the dialectic which lies between the interconnected worlds of technology and spatial awareness. It builds upon the open program of being in and around the lightness of absense."
                  },
                  {
                    "title": "Manhattan Glass",
                    "is_public": true,
                    "url": "http://karim.naaji.fr/images/tile-pbrt-bsdf.png",
                    "thumb_url": "http://karim.naaji.fr/images/tile-pbrt-bsdf.png",
                    "author_name": "Karim Naaji",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56e1ee0917bbab454407c2d9",
                    "created": "2016-06-24T20:27:50.730Z",
                    "modified": "2016-06-24T20:27:50.730Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "BMO meets Shepherd Fairey",
                    "is_public": true,
                    "url": "https://dl.dropboxusercontent.com/u/500578768/forFrames/3D-BMO-03-CA.jpg",
                    "thumb_url": "https://dl.dropboxusercontent.com/u/500578768/forFrames/3D-BMO-03-CA.jpg",
                    "author_name": "Christopher Abbas ",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "5763622fc0006da8310e8a6c",
                    "created": "2016-06-22T19:01:06.138Z",
                    "modified": "2016-06-22T19:01:06.138Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Linky: Moby Dick",
                    "is_public": true,
                    "url": "https://phiffer.org/linky/moby-dick?wait=10",
                    "thumb_url": "https://phiffer.org/linky/img/moby-dick.png",
                    "author_name": "Dan Phiffer",
                    "plugins": {},
                    "format": "openframe-website",
                    "ownerId": "3",
                    "created": "2016-06-21T19:26:08.320Z",
                    "modified": "2016-06-21T19:26:08.320Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Test",
                    "is_public": false,
                    "url": "http://wohllabs.com/polygonExample",
                    "thumb_url": "",
                    "author_name": "OF",
                    "plugins": {},
                    "format": "openframe-of",
                    "ownerId": "3",
                    "created": "2016-06-19T22:06:32.064Z",
                    "modified": "2016-06-19T22:06:32.064Z",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "BluePrint",
                    "is_public": true,
                    "url": "https://dl.dropboxusercontent.com/u/335522/openframe/tangram/blueprint.yaml",
                    "thumb_url": "http://tangrams.github.io/tangram-sandbox/styles/blueprint.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-tangram",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-06-17T14:57:53.357Z",
                    "modified": "2016-06-17T14:57:53.357Z",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Tron",
                    "is_public": true,
                    "url": "https://dl.dropboxusercontent.com/u/335522/openframe/tangram/tron.yaml",
                    "thumb_url": "http://tangrams.github.io/tangram-sandbox/styles/tron.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-tangram",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-06-17T14:57:09.115Z",
                    "modified": "2016-06-17T14:57:09.115Z",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Gotham",
                    "is_public": true,
                    "url": "https://dl.dropboxusercontent.com/u/335522/openframe/tangram/gotham.yaml",
                    "thumb_url": "http://tangrams.github.io/tangram-sandbox/styles/gotham.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-tangram",
                    "ownerId": "3",
                    "created": "2016-06-17T14:56:25.138Z",
                    "modified": "2016-06-17T14:56:25.138Z",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Matrix",
                    "is_public": true,
                    "url": "https://dl.dropboxusercontent.com/u/335522/openframe/tangram/matrix.yaml",
                    "thumb_url": "http://tangrams.github.io/tangram-sandbox/styles/matrix.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-tangram",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-06-17T14:53:00.105Z",
                    "modified": "2016-06-17T14:53:00.105Z",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Lego",
                    "is_public": true,
                    "url": "https://dl.dropboxusercontent.com/u/335522/openframe/tangram/lego.yaml",
                    "thumb_url": "http://tangrams.github.io/tangram-sandbox/styles/lego.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-tangram",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-06-16T19:52:22.382Z",
                    "modified": "2016-06-16T19:52:22.382Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Tangram Blocks",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160615111404.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160615111404.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-06-15T11:13:29.971Z",
                    "modified": "2016-06-15T11:13:29.971Z",
                    "format_other": "openframe-tangram",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "StreamVoid",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160615110311.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160614015139.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-06-14T01:51:06.492Z",
                    "modified": "2016-06-14T01:51:06.492Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "PulseStream",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160611173915.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160611173915.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-06-11T17:38:44.867Z",
                    "modified": "2016-06-11T17:38:44.867Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Metronom",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160608204022.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160608204022.png",
                    "author_name": "Guido Schmidt",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "5752db70c0006da8310e891d",
                    "created": "2016-06-08T20:39:53.580Z",
                    "modified": "2016-06-08T20:39:53.580Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "RoseDream",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160605165154.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160605165154.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-06-05T16:51:28.782Z",
                    "modified": "2016-06-05T16:51:28.781Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Recoding Bridget Riley",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160605154024.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160605154024.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-06-05T15:39:58.532Z",
                    "modified": "2016-06-05T15:39:58.532Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Spring",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160604182710.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160604182710.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-06-04T18:26:45.464Z",
                    "modified": "2016-06-04T18:26:45.464Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Electric Jelly",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160604141015.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160604141015.png",
                    "author_name": "Guido Schmidt",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "5752db70c0006da8310e891d",
                    "created": "2016-06-04T14:09:50.377Z",
                    "modified": "2016-06-04T14:09:50.377Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Transmutatio",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160602154307.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160602154307.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-06-02T15:42:43.382Z",
                    "modified": "2016-06-02T15:42:43.382Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Nekyia",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160521211926.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160521211926.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-05-21T21:19:12.872Z",
                    "modified": "2016-05-21T21:19:12.872Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "waves3",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160521110641.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160521110641.png",
                    "author_name": "Nicolas Barradeau",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "572edcc9c0006da8310e84ef",
                    "created": "2016-05-21T11:06:32.208Z",
                    "modified": "2016-05-21T11:06:32.208Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "chrome grill",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160521044150.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160521044150.png",
                    "author_name": "Felix Turner",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "5730d6a5c0006da8310e852f",
                    "created": "2016-05-21T04:41:37.446Z",
                    "modified": "2016-05-21T04:41:37.446Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "ocean",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160520164207.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160520164207.png",
                    "author_name": "jfledd",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "5734d8eac0006da8310e85a8",
                    "created": "2016-05-20T16:41:54.736Z",
                    "modified": "2016-05-20T16:41:54.736Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Gilmore Leaves",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160520155237.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160520155237.png",
                    "author_name": "Felix Turner",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "5730d6a5c0006da8310e852f",
                    "created": "2016-05-20T15:52:24.343Z",
                    "modified": "2016-05-20T15:52:24.343Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "StripeSphere",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160517200804.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160517200804.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-05-17T20:07:53.915Z",
                    "modified": "2016-05-17T20:07:53.915Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Zentrale Schwerkraft - Milan Dobes (1963)",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160516235834.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160516235834.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-05-16T23:58:24.554Z",
                    "modified": "2016-05-16T23:58:24.554Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Movement in Squares - Bridget Riley (1961)",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160516233753.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160516233753.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-05-16T23:37:43.358Z",
                    "modified": "2016-05-16T23:37:43.358Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Francois Morellet",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160516140131.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160516140131.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-05-16T14:01:22.010Z",
                    "modified": "2016-05-16T14:01:22.010Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Blob",
                    "is_public": true,
                    "url": "http://r21nomi.github.io/processing_work/pages/BlobDrawer",
                    "thumb_url": "http://r21nomi.github.io/processing_work/images/blob.gif",
                    "author_name": "r21nomi",
                    "plugins": {},
                    "format": "openframe-website",
                    "ownerId": "5731096cc0006da8310e8533",
                    "created": "2016-05-15T13:33:28.603Z",
                    "modified": "2016-05-15T13:33:28.603Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Rotation Acel by Julio Le Parc",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160513201554.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160513201554.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-05-13T20:15:47.187Z",
                    "modified": "2016-05-13T20:15:47.187Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Bleu Sur Blanc by Julio Le Parc",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160513193817.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160513193817.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-05-13T19:38:10.629Z",
                    "modified": "2016-05-13T19:38:10.629Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Time Delay",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160513002137.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160513002137.png",
                    "author_name": "@jfledd - 2016",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "5734d8eac0006da8310e85a8",
                    "created": "2016-05-13T00:21:30.931Z",
                    "modified": "2016-05-13T00:21:30.931Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Looping Motion",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160512232253.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160512232253.png",
                    "author_name": "@jfledd - 2016",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "5734d8eac0006da8310e85a8",
                    "created": "2016-05-12T23:22:46.549Z",
                    "modified": "2016-05-12T23:22:46.549Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "HUD",
                    "is_public": true,
                    "url": "https://thebookofshaders.com/log/160512205153.frag",
                    "thumb_url": "https://thebookofshaders.com/log/160512205153.png",
                    "author_name": "Joshua Fledderjohn",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "5734d8eac0006da8310e85a8",
                    "created": "2016-05-12T20:51:47.002Z",
                    "modified": "2016-05-12T20:51:47.002Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Here and There",
                    "is_public": false,
                    "url": "http://wohllabs.com/Here%20and%20There-SD.mp4",
                    "thumb_url": "",
                    "author_name": "Jason Bahling",
                    "plugins": {},
                    "format": "openframe-video",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-05-11T23:53:55.787Z",
                    "modified": "2016-05-11T23:53:55.787Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Patterns",
                    "is_public": false,
                    "url": "http://wohllabs.com/PatternsInNature.mp4",
                    "thumb_url": "",
                    "author_name": "Jason Bahling",
                    "plugins": {},
                    "format": "openframe-video",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-05-11T23:46:31.038Z",
                    "modified": "2016-05-11T23:46:31.038Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Lemercier s grid",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160506171132.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160506171132.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-05-06T17:09:11.179Z",
                    "modified": "2016-05-06T17:09:11.179Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Slime Glass",
                    "is_public": false,
                    "url": "http://otoro.net/ml/slimevolley/slimeglass.html",
                    "thumb_url": "",
                    "author_name": "Otoro",
                    "plugins": {},
                    "format": "openframe-website",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-05-05T17:37:22.966Z",
                    "modified": "2016-05-05T17:37:22.966Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "NN Website ",
                    "is_public": false,
                    "url": "http://otoro.net/ml/neat-playground/",
                    "thumb_url": "",
                    "author_name": "Test",
                    "plugins": {},
                    "format": "openframe-website",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-05-05T01:17:57.935Z",
                    "modified": "2016-05-05T01:17:57.935Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Another Test",
                    "is_public": false,
                    "url": "https://drive.google.com/file/d/0B1WsXKp9bkrpT0FIVmZtcmJxbm8/view?usp=sharing",
                    "thumb_url": "",
                    "author_name": "Blacki",
                    "plugins": {},
                    "format": "openframe-video",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-05-04T19:26:04.849Z",
                    "modified": "2016-05-04T19:26:04.849Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "IChing",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160510011212.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160510011212.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-05-03T00:16:58.030Z",
                    "modified": "2016-05-03T00:16:58.030Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Silexars",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160502195329.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160502195329.png",
                    "author_name": "www.shadertoy.com/view/XsXXDn",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "5709c8ece1f87ce61cc0af6d",
                    "created": "2016-05-02T19:51:48.481Z",
                    "modified": "2016-05-02T19:51:48.481Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Test",
                    "is_public": false,
                    "url": "http://wohllabs.com/vid_test_smaller.mp4",
                    "thumb_url": "",
                    "author_name": "Blacki",
                    "plugins": {},
                    "format": "openframe-video",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-05-02T01:00:19.936Z",
                    "modified": "2016-05-02T01:00:19.936Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "--",
                    "is_public": false,
                    "url": "http://otoro.net/ml/pendulum-cne/index.html",
                    "thumb_url": "",
                    "author_name": "--",
                    "plugins": {},
                    "format": "openframe-website",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-04-28T23:01:55.843Z",
                    "modified": "2016-04-28T23:01:55.843Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Minor Disruption",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160427194208.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160427194208.png",
                    "author_name": "Jonathan Wohl",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-04-27T19:40:32.414Z",
                    "modified": "2016-04-27T19:40:32.414Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Shiny Circle",
                    "is_public": true,
                    "url": "http://philippwambach.de/shiny_circle.frag",
                    "thumb_url": "http://philippwambach.de/shiny_circle.png",
                    "author_name": "Philipp Wambach",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56e12fbd17bbab454407c2bd",
                    "created": "2016-04-27T19:36:16.762Z",
                    "modified": "2016-04-27T19:36:16.761Z",
                    "format_other": ""
                  },
                  {
                    "title": "Test",
                    "is_public": false,
                    "url": "http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_2mb.mp4",
                    "thumb_url": "",
                    "author_name": "Test",
                    "plugins": {},
                    "format": "openframe-video",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-04-23T15:16:08.870Z",
                    "modified": "2016-04-23T15:16:08.870Z",
                    "format_other": "",
                    "config": {
                      "--aspect-mode": "fill"
                    }
                  },
                  {
                    "title": "Quadtone Timer",
                    "is_public": false,
                    "url": "http://thebookofshaders.com/log/160423134529.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160423134529.png",
                    "author_name": "Jonathan Wohl",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-04-23T13:43:55.402Z",
                    "modified": "2016-04-23T13:43:55.402Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "chroma flames",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160414215058.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160414215058.png",
                    "author_name": "sm",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "57101031507bfb8922c89965",
                    "created": "2016-04-14T21:49:32.253Z",
                    "modified": "2016-04-14T21:49:32.253Z",
                    "format_other": ""
                  },
                  {
                    "title": "Unknown",
                    "is_public": false,
                    "url": "http://survivingchurch.org/wp-content/uploads/2015/07/map-york.jpg",
                    "thumb_url": "http://survivingchurch.org/wp-content/uploads/2015/07/map-york.jpg",
                    "author_name": "Unknown",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-04-14T15:44:33.151Z",
                    "modified": "2016-04-14T15:44:33.151Z",
                    "format_other": "openframe-ascii-image"
                  },
                  {
                    "title": "Srect",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160414152527.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160414152527.png",
                    "author_name": "Magnus",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "570fb42e507bfb8922c89950",
                    "created": "2016-04-14T15:24:02.207Z",
                    "modified": "2016-04-14T15:24:02.207Z",
                    "format_other": ""
                  },
                  {
                    "title": "1460630412513",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160414114652.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160414114652.png",
                    "author_name": "unknown",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "57093e10e1f87ce61cc0af5f",
                    "created": "2016-04-14T14:40:58.565Z",
                    "modified": "2016-04-14T14:40:58.565Z",
                    "format_other": ""
                  },
                  {
                    "title": "gradient ",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160414143756.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160414143756.png",
                    "author_name": "RosaHD",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "570f3d1d507bfb8922c897fb",
                    "created": "2016-04-14T14:36:32.092Z",
                    "modified": "2016-04-14T14:36:32.092Z",
                    "format_other": ""
                  },
                  {
                    "title": "1460640017199",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160414134236.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160414134236.png",
                    "author_name": "RosaHD",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "570f3d1d507bfb8922c897fb",
                    "created": "2016-04-14T13:41:11.583Z",
                    "modified": "2016-04-14T13:41:11.583Z",
                    "format_other": ""
                  },
                  {
                    "title": "1460633039858",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160414131606.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160414131606.png",
                    "author_name": "Rect Color",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "570f95f0507bfb8922c8981a",
                    "created": "2016-04-14T13:23:45.456Z",
                    "modified": "2016-04-14T13:23:45.456Z",
                    "format_other": ""
                  },
                  {
                    "title": "Gnolemite",
                    "is_public": true,
                    "url": "https://s3-eu-west-1.amazonaws.com/samelie.com/Screen+Shot+2015-08-02+at+23.10.23.png?X-Amz-Date=20160414T103053Z&X-Amz-Expires=300&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=cdcfd05ccc1ce77c0367fe976a1244677326c52fb4a8fe339229e73a53b65a8c&X-Amz-Credential=ASIAJXNZAPWON2TTT4AA/20160414/eu-west-1/s3/aws4_request&X-Amz-SignedHeaders=Host&x-amz-security-token=FQoDYXdzEFwaDInyDfmcC/y7H/UrhSLHAWFf%2BavPOuBVbafGNk2HpGSh/8OkPWkZ5CZUIG5GEHsynwItAMO6gCEH4RSXZQiSaCahe4UeOtZYlsurOUJea9%2BowQ9IOb0T1tsFQENoB/vA5filoME%2BIvfixmWwlj2cZYgvMfV5qWbsTR8bYUcY8dByTeri%2B/WGq/zRuOsceNHIjO//3BYA5bQ3xYO7QS008p4WW%2BeBYJJuwNGvfq9n6Ab1f8i273O67IUNR%2BEO%2Bp4VpQ5eEVi0nW%2BH3b2jMCxIkQ89Y6F9N7EoheK9uAU%3D",
                    "thumb_url": "",
                    "author_name": "Sam Elie",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "570f7069507bfb8922c89812",
                    "created": "2016-04-14T10:31:10.227Z",
                    "modified": "2016-04-14T10:31:10.227Z",
                    "format_other": ""
                  },
                  {
                    "title": "pointing at the moon",
                    "is_public": true,
                    "url": "http://andyinabox.github.io/moon-map-wanderer/",
                    "thumb_url": "https://raw.githubusercontent.com/andyinabox/moon-map-wanderer/master/screen.png",
                    "author_name": "Andy Dayton",
                    "plugins": {},
                    "format": "openframe-website",
                    "ownerId": "56e60284a6b560d60618466b",
                    "created": "2016-04-11T20:43:40.589Z",
                    "modified": "2016-04-11T20:43:40.589Z",
                    "format_other": ""
                  },
                  {
                    "title": "unknown",
                    "is_public": false,
                    "url": "http://thebookofshaders.com/log/160408213710.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160408213710.png",
                    "author_name": "@patriciogv - 2015",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-04-11T09:47:17.298Z",
                    "modified": "2016-04-11T09:47:17.298Z"
                  },
                  {
                    "title": "DigiCascade ",
                    "is_public": false,
                    "url": "http://thebookofshaders.com/log/160401200714.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160401200714.png",
                    "author_name": "Patricio Gonzalez Vivo (@patriciogv)",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-04-07T16:20:23.176Z",
                    "modified": "2016-04-07T16:20:23.176Z"
                  },
                  {
                    "title": "recoded Fractal Invaders by Jared Tarbell",
                    "is_public": false,
                    "url": "http://thebookofshaders.com/log/160401163851.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160401163851.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-04-07T16:19:11.515Z",
                    "modified": "2016-04-07T16:19:11.515Z"
                  },
                  {
                    "title": "Triangles",
                    "is_public": false,
                    "url": "http://thebookofshaders.com/log/160306113630.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160306113630.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-04-07T16:18:01.289Z",
                    "modified": "2016-04-07T16:18:01.289Z"
                  },
                  {
                    "title": "Cosmic Ripples",
                    "is_public": false,
                    "url": "http://thebookofshaders.com/log/160308160958.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160308160958.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-04-06T21:37:40.546Z",
                    "modified": "2016-04-06T21:37:40.546Z"
                  },
                  {
                    "title": "unknown",
                    "is_public": false,
                    "url": "http://thebookofshaders.com/log/160405204023.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160405204023.png",
                    "author_name": "unknown",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-04-06T21:35:20.562Z",
                    "modified": "2016-04-06T21:35:20.562Z"
                  },
                  {
                    "title": "YesPls",
                    "is_public": true,
                    "url": "http://soak-blog.andrewkelsalldes.netdna-cdn.com/wp-content/uploads/2011/11/weird-art-artwork-exhibition-7.jpg",
                    "thumb_url": "http://soak-blog.andrewkelsalldes.netdna-cdn.com/wp-content/uploads/2011/11/weird-art-artwork-exhibition-7.jpg",
                    "author_name": "MOOz",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "57041beee1f87ce61cc0af03",
                    "created": "2016-04-05T20:15:26.796Z",
                    "modified": "2016-04-05T20:15:26.796Z"
                  },
                  {
                    "title": "ABC",
                    "is_public": true,
                    "url": "http://edition.cnn.com/",
                    "thumb_url": "https://cnncommentary.files.wordpress.com/2015/09/donald_trump_2016_cnn_debate_091515_500x293.jpg",
                    "author_name": "Xmix",
                    "plugins": {},
                    "format": "openframe-website",
                    "ownerId": "57041beee1f87ce61cc0af03",
                    "created": "2016-04-05T20:13:40.781Z",
                    "modified": "2016-04-05T20:13:40.781Z"
                  },
                  {
                    "title": "Everest",
                    "is_public": false,
                    "url": "http://www.codex99.com/cartography/images/everest/everest_imhof_lg.jpg",
                    "thumb_url": "http://www.codex99.com/cartography/images/everest/everest_imhof_lg.jpg",
                    "author_name": "Mappy Mapper",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-04-03T16:07:17.202Z",
                    "modified": "2016-04-03T16:07:17.202Z",
                    "format_other": "openframe-ascii-image"
                  },
                  {
                    "title": "recoded Fractal Invaders by Jared Tarbell",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160503001245.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160503001245.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-04-01T21:31:30.553Z",
                    "modified": "2016-04-01T21:31:30.552Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "chaos-order-chaos",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160401203223.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160401203223.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-04-01T20:31:08.567Z",
                    "modified": "2016-04-01T20:31:08.567Z"
                  },
                  {
                    "title": "Wheat Field Under Threatening Skies",
                    "is_public": true,
                    "url": "http://i.imgur.com/SnmTD.jpg",
                    "thumb_url": "http://i.imgur.com/SnmTD.jpg",
                    "author_name": "Vincent Van Gogh",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56ef4e6aa6b560d606184755",
                    "created": "2016-03-31T20:16:22.959Z",
                    "modified": "2016-03-31T20:16:22.959Z"
                  },
                  {
                    "title": "The Little Spanish Prison",
                    "is_public": true,
                    "url": "http://i.imgur.com/GUHam.jpg",
                    "thumb_url": "http://i.imgur.com/GUHam.jpg",
                    "author_name": "Robert Motherwell",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56ef4e6aa6b560d606184755",
                    "created": "2016-03-31T20:15:41.350Z",
                    "modified": "2016-03-31T20:15:41.350Z"
                  },
                  {
                    "title": "Corn Poppy",
                    "is_public": true,
                    "url": "http://i.imgur.com/7Xme4.jpg",
                    "thumb_url": "http://i.imgur.com/7Xme4.jpg",
                    "author_name": "Kees van Dongen",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56ef4e6aa6b560d606184755",
                    "created": "2016-03-31T20:11:13.920Z",
                    "modified": "2016-03-31T20:11:13.920Z"
                  },
                  {
                    "title": "Untitled",
                    "is_public": true,
                    "url": "https://farm4.staticflickr.com/3464/3939752992_64e817967e_s.jpg",
                    "thumb_url": "https://farm4.staticflickr.com/3464/3939752992_64e817967e_s.jpg",
                    "author_name": "M V Benevento",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56fad3a6a2d20f2024764a48",
                    "created": "2016-03-29T19:43:30.152Z",
                    "modified": "2016-03-29T19:43:30.152Z"
                  },
                  {
                    "title": "Stonehenge Wave Reduction",
                    "is_public": true,
                    "url": "http://wowak.com/tot/wp-content/uploads/2014/09/stonehinge-wave-reduction-1024x576.jpg",
                    "thumb_url": "http://wowak.com/tot/wp-content/uploads/2014/09/stonehinge-wave-reduction-1024x576.jpg",
                    "author_name": "Bradley L. Johnson",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56f9a07aa2d20f2024764991",
                    "created": "2016-03-28T21:25:22.679Z",
                    "modified": "2016-03-28T21:25:22.679Z"
                  },
                  {
                    "title": "Welcome To Earth",
                    "is_public": true,
                    "url": "http://wowak.com/tot/wp-content/uploads/2015/07/WelcomeToEarth3Rotate.gif",
                    "thumb_url": "http://wowak.com/tot/wp-content/uploads/2015/07/WelcomeToEarth3Rotate.gif",
                    "author_name": "Bradley L. Johnson",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56f9a07aa2d20f2024764991",
                    "created": "2016-03-28T21:24:25.108Z",
                    "modified": "2016-03-28T21:24:25.108Z"
                  },
                  {
                    "title": "Face Space #1 (Helen image dataset)",
                    "is_public": true,
                    "url": "https://andyinabox.github.io/helen-face-space/",
                    "thumb_url": "https://github.com/andyinabox/helen-face-space/raw/master/preview.png",
                    "author_name": "Andy Dayton",
                    "plugins": {},
                    "format": "openframe-website",
                    "ownerId": "56e60284a6b560d60618466b",
                    "created": "2016-03-22T21:46:29.864Z",
                    "modified": "2016-03-22T21:46:29.864Z"
                  },
                  {
                    "title": "1458397351789",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160319142926.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160319142926.png",
                    "author_name": "@patriciogv ( patriciogonzalezvivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56ed60f9a6b560d606184722",
                    "created": "2016-03-19T14:28:21.714Z",
                    "modified": "2016-03-19T14:28:21.714Z"
                  },
                  {
                    "title": "ml4a",
                    "is_public": false,
                    "url": "http://ml4a.github.io/dev/demos/mnist_forwardpass.html",
                    "thumb_url": "http://ml4a.github.io/dev/demos/mnist/mnist_forwardpass.html",
                    "author_name": "Gene Kogan",
                    "plugins": {},
                    "format": "openframe-website",
                    "ownerId": "56c4802c30eda27c7a0de423",
                    "created": "2016-03-17T20:06:33.239Z",
                    "modified": "2016-03-17T20:06:33.239Z"
                  },
                  {
                    "title": "So Intimate 41",
                    "is_public": true,
                    "url": "http://mrzl.net/wp-content/uploads/2014/07/result_postpro_41.jpg",
                    "thumb_url": "http://mrzl.net/wp-content/uploads/2014/07/result_postpro_41.jpg",
                    "author_name": "Marcel Schwittlick",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56e5c812a6b560d606184660",
                    "created": "2016-03-13T20:10:11.142Z",
                    "modified": "2016-03-13T20:10:11.142Z"
                  },
                  {
                    "title": "landscape.3",
                    "is_public": true,
                    "url": "http://inconvergent.net/img/openframe/landscape-3.png",
                    "thumb_url": "http://inconvergent.net/img/openframe/landscape-3.png",
                    "author_name": "inconvergent",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56e5b05ca6b560d60618463c",
                    "created": "2016-03-13T18:42:47.240Z",
                    "modified": "2016-03-13T18:42:47.240Z"
                  },
                  {
                    "title": "landscape.2",
                    "is_public": true,
                    "url": "http://inconvergent.net/img/openframe/landscape-2.png",
                    "thumb_url": "http://inconvergent.net/img/openframe/landscape-2-sub.png",
                    "author_name": "inconvergent",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56e5b05ca6b560d60618463c",
                    "created": "2016-03-13T18:42:23.824Z",
                    "modified": "2016-03-13T18:42:23.824Z"
                  },
                  {
                    "title": "landscape.1",
                    "is_public": true,
                    "url": "http://inconvergent.net/img/openframe/landscape-1.png",
                    "thumb_url": "http://inconvergent.net/img/openframe/landscape-1-sub.png",
                    "author_name": "Inconvergent",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56e5b05ca6b560d60618463c",
                    "created": "2016-03-13T18:28:59.731Z",
                    "modified": "2016-03-13T18:28:59.731Z"
                  },
                  {
                    "title": "IChing",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160313193711.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160313193711.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-03-13T16:29:36.320Z",
                    "modified": "2016-03-13T16:29:36.320Z"
                  },
                  {
                    "title": "Classic Retro Black and White Plasma",
                    "is_public": true,
                    "url": "http://hugolaliberte.com/assets/openframes/plasma.frag",
                    "thumb_url": "http://hugolaliberte.com/assets/img/shaders-preview/plasma.png",
                    "author_name": "Hugo Laliberté",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56e45eee44973147579abbb7",
                    "created": "2016-03-13T03:19:27.293Z",
                    "modified": "2016-03-13T03:19:27.293Z"
                  },
                  {
                    "title": "MoonGaze",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160313030533.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160313030533.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-03-13T03:04:35.376Z",
                    "modified": "2016-03-13T03:04:35.376Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "lineRipples",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160617155726.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160617155726.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-03-13T02:55:08.347Z",
                    "modified": "2016-03-13T02:55:08.347Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Rainbow",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160312145523.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160312145523.png",
                    "author_name": "Toshiya Momota",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56e42d9344973147579abba3",
                    "created": "2016-03-12T14:54:25.783Z",
                    "modified": "2016-03-12T14:54:25.783Z"
                  },
                  {
                    "title": "Autumn Leaves",
                    "is_public": true,
                    "url": "http://retrodictable.com/wp-content/uploads/2015/11/autumnleaves.jpg",
                    "thumb_url": "http://retrodictable.com/wp-content/uploads/2015/11/autumnleaves.jpg",
                    "author_name": "Christo Allegra",
                    "plugins": {},
                    "format": "openframe-image",
                    "ownerId": "56c726d9045cfc7a38c79497",
                    "created": "2016-03-10T00:35:42.947Z",
                    "modified": "2016-03-10T00:35:42.947Z"
                  },
                  {
                    "title": "Winter",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160503001527.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160503001527.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-03-08T01:43:17.480Z",
                    "modified": "2016-03-08T01:43:17.480Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "Mandala V (white over black)",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160503001417.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160503001417.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-03-07T21:37:24.368Z",
                    "modified": "2016-03-07T21:37:24.368Z",
                    "format_other": "",
                    "aspect_mode": "fill"
                  },
                  {
                    "title": "10 PRINT",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160306213426.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160306213426.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-03-06T21:33:32.783Z",
                    "modified": "2016-03-06T21:33:32.783Z"
                  },
                  {
                    "title": "9 Moons",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160304203554.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160304203554.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-03-04T20:35:02.237Z",
                    "modified": "2016-03-04T20:35:02.237Z"
                  },
                  {
                    "title": "9 Moons",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160304203331.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160304203331.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-03-04T20:32:38.601Z",
                    "modified": "2016-03-04T20:32:38.601Z"
                  },
                  {
                    "title": "Moons",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160304202332.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160304202332.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-03-04T20:22:40.071Z",
                    "modified": "2016-03-04T20:22:40.071Z"
                  },
                  {
                    "title": "DeFrag",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160302022724.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160302022724.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-03-02T15:58:57.234Z",
                    "modified": "2016-03-02T15:58:57.234Z"
                  },
                  {
                    "title": "DataStream",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160302102102.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160302102102.png",
                    "author_name": "Paitricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-03-02T10:20:12.202Z",
                    "modified": "2016-03-02T10:20:12.202Z"
                  },
                  {
                    "title": "PISCES",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160302101618.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160302101618.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-03-02T10:15:28.640Z",
                    "modified": "2016-03-02T10:15:28.640Z"
                  },
                  {
                    "title": "SimplexNoise",
                    "is_public": true,
                    "url": "http://thebookofshaders.com/log/160302101337.frag",
                    "thumb_url": "http://thebookofshaders.com/log/160302101337.png",
                    "author_name": "Patricio Gonzalez Vivo",
                    "plugins": {},
                    "format": "openframe-glslviewer",
                    "ownerId": "56c5d01c3aa3a01d02aecd3f",
                    "created": "2016-03-02T10:12:48.062Z",
                    "modified": "2016-03-02T10:12:48.062Z"
                  }
                ], function(err, artwork) {
                    if (err) reject(err);
                    debug('Artworks created');
                    resolve(artwork);
                });
            });
        }

        function createChannels() {
            return new Promise(function(resolve, reject) {
                app.models.Channel.create([{
                    name: 'The Notion Collective',
                    description: 'A selection of conceptual works on screen.',
                    ownerId: 1,
                    thumb_url: 'https://c6.staticflickr.com/6/5596/15147144565_d76f3a27cf_n.jpg',
                    is_public: true
                }, {
                    name: 'Openframe Picks',
                    description: 'The official channel of selections from Openframe.',
                    ownerId: 2,
                    thumb_url: 'https://c6.staticflickr.com/3/2945/15299537669_76e6ba0d70_n.jpg',
                    is_public: true
                }, {
                    name: 'SFPC',
                    description: 'A mix of student and guest artist works in various formats.',
                    ownerId: 2,
                    thumb_url: 'https://c3.staticflickr.com/3/2850/12287451034_d36808fb97_n.jpg',
                    is_public: true
                }, {
                    name: 'Transfer',
                    description: 'New works from new NYC-based artists.',
                    ownerId: 3,
                    thumb_url: 'https://c4.staticflickr.com/3/2826/11522538323_468c75b8b3_n.jpg',
                    is_public: true
                }], function(err, channels) {
                    if (err) reject(err);
                    debug('Channels created');
                    resolve(channels);
                });
            });
        }

        function createCollections() {
            return new Promise(function(resolve, reject) {
                app.models.Collection.create([{
                    name: 'Maps',
                    description: 'A collection of maps; all maps, all the time.',
                    ownderId: 1,
                    thumb_url: 'https://c4.staticflickr.com/3/2826/11522538323_468c75b8b3_n.jpg',
                    count: 12,
                    is_public: true,
                    id: 1
                }, {
                    name: 'Minimal B&W',
                    description: 'Unobtrusive, minimal works in B&W.',
                    ownerId: 2,
                    thumb_url: 'https://c3.staticflickr.com/3/2850/12287451034_d36808fb97_n.jpg',
                    count: 39,
                    is_public: true,
                    id: 2
                }, {
                    name: 'Alt-AI',
                    description: 'Works presented at the Alt-AI conference.',
                    ownerId: 3,
                    thumb_url: 'https://c6.staticflickr.com/3/2945/15299537669_76e6ba0d70_n.jpg',
                    count: 87,
                    is_public: true,
                    id: 3
                }], function(err, collections) {
                    if (err) reject(err);
                    debug('collections created');
                    resolve(collections);
                });
            });
        }

        function formRelationships(values) {
            debug('formRelationships', values);
            var users = values[0],
                artworks = values[1],
                frames = values[2],
                channels = values[3],
                collections = values[4];

            // add each user as manager of frame[1], add some likes for each user
            users.forEach(function(user) {
                // all users can manage frame id:2 (idx 1)
                user.managed_frames.add(frames[1]);

                user.liked_artwork.add(artworks[14]);
                user.liked_artwork.add(artworks[25]);
                user.liked_artwork.add(artworks[16]);
                user.liked_artwork.add(artworks[17]);
            });

            // add an 'owner' user to each frame
            // frames.forEach(function(frame, idx) {
            //     // each user owns one frame
            //     frame.owner(users[idx]);
            //     frame.save();
            // });

            collections.forEach(function(col) {
                console.log(col);
                var _artworks = _.shuffle(artworks);
                _artworks.forEach(function(art) {
                    console.log(art);
                    col.artwork.add(art);
                });
            });
        }


    });
};
