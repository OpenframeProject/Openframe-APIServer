_.templateSettings = {
    evaluate:    /\{\{(.+?)\}\}/g,
    interpolate: /\{\{=(.+?)\}\}/g,
    escape:      /\{\{-(.+?)\}\}/g
};

$(function() {
    var collections = [],
        ownedFrames = [],
        managedFrames = [],
        currentFrame,
        $rowCollection = $('.row-collection'),
        artworkTemplate = _.template($('#ArtworkTemplate').text());

    function fetchUser() {
        return $.get('/api/OpenframeUsers/' + window.USER_ID, {
            'filter': {
                'include': [
                    'owned_artwork',
                    'owned_frames',
                    'managed_frames',
                    {
                        collections: {
                            relation: 'artwork',
                            scope: {
                                order: 'created DESC'
                            }
                        }
                    }
                ]
            }
        });
    }

    function fetchCollection(id) {
        return $.get('/api/OpenframeUsers/' + window.USER_ID + '/collections/' + id, {
            'filter': {
                'include': [
                    'artwork'
                ]
            }
        });
    }

    function renderCollection(artworks) {
        artworks.forEach(function(artwork) {
            $rowCollection.append(artworkTemplate(artwork));
        });
    }

    function init() {

        fetchUser()
            .done(function(user) {
                console.log(user);
                collections = user.collections;
                renderCollection(collections[0].artwork);
                // $rowCollection.find('ul')wookmark({
                //     itemWidth: '25%'
                // });
            })
            .fail(function(err) {
                console.log(err);
            });

    }

    init();
});

