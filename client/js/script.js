$(function( ) {
    var _user = {},
        collections = [],
        allFrames = [],
        currentFrame,
        currentCollection,
        $rowCollection = $('.row-collection'),
        $frameDropdown = $('.dropdown-frames'),
        artworkTemplate = _.template($('#ArtworkTemplate').text()),
        framesDropdownTemplate = _.template($('#FramesDropdownTemplate').text());

    function fetchUser(includeCollections) {
        console.log('fetchUser', includeCollections);
        var filter = {};
        if (includeCollections) {
            filter = {
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
            };
        }
        return $.get('/api/users/' + window.USER_ID, filter);
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

    // Return the current stream.
    // TODO: pagination
    function fetchStream(skip) {
        skip = skip || 0;
        return $.get('/api/artwork/stream', {
            'filter': {
                'skip': skip
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
    function renderCollection(artworks) {
        console.log('renderCollection', artworks);
        if (!artworks || !artworks.length) return;
        artworks.forEach(function(artwork) {
            addFormatDisplayName(artwork);
            artwork.disabled = currentFrame && currentFrame.plugins.hasOwnProperty(artwork.format) ? 'btn-push--enabled' : 'btn-push--disabled';
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

    // add more human-friendly names for the standard three plugins
    function addFormatDisplayName(artwork) {
        switch (artwork.format) {
            case 'openframe-glslviewer':
                artwork.formatDisplayName = 'shader';
                break;
            case 'openframe-image':
                artwork.formatDisplayName = 'image';
                break;
            case 'openframe-website':
                artwork.formatDisplayName = 'website';
                break;
            default:
                artwork.formatDisplayName = artwork.format;
        }
    }

    // zip through and setup event handlers
    function bindEvents() {
        console.log('bindEvents');
        $(document).on('click', '.btn-push--enabled', function(e) {
            var artworkId = $(this).data('artworkid'),
                // get the artwork data from the collection
                artwork = _.find(currentCollection, function(artworkData) {
                    return artworkData.id === artworkId;
                });

            if (artwork && currentFrame) {
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
        });
    }

    function init() {
        bindEvents();

        fetchFrames().then(function(frames) {
            renderFrameDropdown();
            fetchUser(window.PATH !== '/stream').then(function(user) {
                console.log(user);
                _user = user;
                if (user.collections) {
                    collections = user.collections;
                    currentCollection = collections[0].artwork;
                    renderCollection(currentCollection);
                }
            }).fail(function(err) {
                console.log(err);
            });


            switch (window.PATH) {
                case '/stream':
                    fetchStream().then(function(stream) {
                        // collections = [stream.artwork];
                        currentCollection = stream.artwork;
                        renderCollection(currentCollection);
                    }).fail(function(err) {
                        console.log(err);
                    });
                    break;
                case '/' + window.USERNAME:

                    break;
                default:

            }
        }).fail(function(err) {
            console.log(err);
        });
    }

    init();
});
