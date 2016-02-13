_.templateSettings = {
    evaluate:    /\{\{(.+?)\}\}/g,
    interpolate: /\{\{=(.+?)\}\}/g,
    escape:      /\{\{-(.+?)\}\}/g
};

$(function() {
    var collections = [],
        ownedFrames = [],
        managedFrames = [],
        allFrames = [],
        currentFrame,
        $rowCollection = $('.row-collection'),
        $frameDropdown = $('.dropdown-frames'),
        artworkTemplate = _.template($('#ArtworkTemplate').text()),
        framesDropdownTemplate = _.template($('#FramesDropdownTemplate').text());

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

    function pushArtwork(frameId, artworkData) {
        return $.post('/api/Frames/' + frameId + '/current_artwork', artworkData);
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

    function selectFrame(_frameId) {
        currentFrame = _.find(allFrames, function(frame) {
            return frame.id === _frameId;
        });
        renderFrameDropdown();
    }

    // render artworks to screen
    function renderCollection(artworks) {
        artworks.forEach(function(artwork) {
            $rowCollection.append(artworkTemplate(artwork));
        });
    }

    // render frame list to screen
    function renderFrameDropdown() {
        var data = {
            currentFrame: currentFrame,
            frames: allFrames
        };
        $frameDropdown.html(framesDropdownTemplate(data));
    }

    // zip through and setup event handlers
    function bindEvents() {
        console.log('bindEvents');
        $(document).on('click', '.btn-push', function(e) {
            var artworkId = $(this).data('artworkid'),
                // get the artwork data from the collection
                artwork = _.find(currentCollection.artwork, function(artworkData) {
                    return artworkData.id === artworkId;
                });

            if (artwork) {
                pushArtwork(currentFrame.id, artwork)
                    .then(function(resp) {
                        console.log(resp);
                    })
                    .fail(function(err) {
                        console.log(err);
                    });
            }
        });

        $(document).on('click', '.frame-select-link', function(e) {
            var frameId = $(this).data('frameid');

            if (frameId) {
                selectFrame(frameId);
            }
        })
    }

    function init() {
        bindEvents();

        fetchUser()
            .done(function(user) {
                console.log(user);
                collections = user.collections;
                currentCollection = collections[0];
                ownedFrames = user.owned_frames;
                managedFrames = user.managed_frames;
                allFrames = ownedFrames.concat(managedFrames);
                currentFrame = user.owned_frames[0];


                renderCollection(collections[0].artwork);
                renderFrameDropdown();

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

