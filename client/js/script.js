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
        return $.get('/api/users/' + window.USER_ID, {
                'filter': {
                    'include': [
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
            }).done(function(user) {
                console.log(user);
                collections = user.collections;
                currentCollection = collections[0];
            });
    }

    function fetchCollection(id) {
        return $.get('/api/users/' + window.USER_ID + '/collections/' + id, {
            'filter': {
                'include': [
                    'artwork'
                ]
            }
        });
    }

    function fetchFrames() {
        console.log('fetchFrames');
        return $.get('/api/users/' + window.USER_ID + '/all_frames').done(function(resp) {
            allFrames = resp.frames;
            if (currentFrame) {
                currentFrame = _.find(allFrames, function(frame) {
                    return currentFrame.id === frame.id;
                });
            } else {
                currentFrame = allFrames[0];
            }
            console.log(allFrames, currentFrame);
        });
    }

    function pushArtwork(frameId, artworkData) {
        return $.ajax({
            url: '/api/frames/' + frameId + '/current_artwork',
            method: 'PUT',
            data: artworkData
        });
    }


    function selectFrame(_frameId) {
        currentFrame = _.find(allFrames, function(frame) {
            return frame.id === _frameId;
        });
        renderFrameDropdown();
    }

    // render artworks to screen
    function renderCollection() {
        var artworks = currentCollection.artwork;
        if (!artworks || !artworks.length) return;
        artworks.forEach(function(artwork) {
            $rowCollection.append(artworkTemplate(artwork));
        });
    }

    // render frame list to screen
    function renderFrameDropdown() {
        console.log('renderFrameDropdown');
        if (!currentFrame || !allFrames.length) return;
        var data = {
            currentFrame: currentFrame,
            frames: allFrames
        };
        $frameDropdown.empty().html(framesDropdownTemplate(data));
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
                        fetchFrames().then(renderFrameDropdown);
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
        var userDfd = fetchUser(),
            framesDfd = fetchFrames();

        $.when(userDfd, framesDfd)
            .done(function() {
                renderCollection();
                renderFrameDropdown();
            })
            .fail(function(err) {
                console.log(err);
            });

    }

    init();
});

