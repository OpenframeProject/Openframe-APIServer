$(function() {
    var _user = {},
        _currentCollectionId,
        collections = [],
        allFrames = [],
        currentFrame,
        currentCollection,
        $rowCollection = $('.row-collection'),
        $frameDropdown = $('.dropdown-frames'),
        artworkTemplate = _.template($('#ArtworkTemplate').text()),
        framesDropdownTemplate = _.template($('#FramesDropdownTemplate').text());

    function selectFrame(_frameId) {
        currentFrame = _.find(allFrames, function(frame) {
            return frame.id === _frameId;
        });
        renderFrameDropdown();
    }

    function removeFrame(frameId) {
        console.log(frameId);
        var index = _.findIndex(allFrames, function(frame) {
            console.log(frame.id, frameId);
            return frame.id.toString() === frameId.toString();
        });
        console.log(index);
        if (index !== -1) {
            allFrames.splice(index, 1);
        }
        if (allFrames.length > 0) {
            currentFrame = allFrames[0];
        } else {
            currentFrame = null;
        }
        renderFrameDropdown();
    }

    // render artworks to screen
    function renderCollection(artworks) {
        console.log('renderCollection', artworks);
        if (!artworks || !artworks.length) return;
        artworks.forEach(function(artwork) {
            renderArtwork(artwork);
        });
    }

    function renderArtwork(artwork, top) {
        addFormatDisplayName(artwork);
        artwork.disabled = currentFrame && currentFrame.plugins.hasOwnProperty(artwork.format) ? 'btn-push--enabled' : 'btn-push--disabled';
        if (top) {
            $('.tile-item').first().after(artworkTemplate(artwork));
        } else {
            $rowCollection.append(artworkTemplate(artwork));
        }
    }

    function removeArtwork(artwork) {
        var index = _.findIndex(currentCollection, function(art) {
            return art.id === artwork.id;
        });
        if (index !== -1) {
            currentCollection.splice(index, 1);
        }
        $('*[data-artworkid="' + artwork.id + '"]').remove();
    }

    function replaceArtwork(artwork) {
        var index = _.findIndex(currentCollection, function(art) {
            return art.id === artwork.id;
        });
        if (index !== -1) {
            currentCollection[index] = artwork;
        }
        addFormatDisplayName(artwork);
        artwork.disabled = currentFrame && currentFrame.plugins.hasOwnProperty(artwork.format) ? 'btn-push--enabled' : 'btn-push--disabled';
        $('*[data-artworkid="' + artwork.id + '"]').replaceWith(artworkTemplate(artwork));
    }

    function hideFrameSettings() {
        $('.btn-frame-settings').addClass('hide');
    }

    function showFrameSettings() {
        $('.btn-frame-settings').removeClass('hide');
    }

    // render frame list to screen
    function renderFrameDropdown() {
        console.log('renderFrameDropdown');
        if (!currentFrame || !allFrames.length) {
            $frameDropdown.empty();
            hideFrameSettings();
            return;
        }
        console.log(currentFrame.ownerId, window.USER_ID);
        if (currentFrame.ownerId.toString() === window.USER_ID.toString()) {
            console.log('show');
            showFrameSettings();
        } else {
            hideFrameSettings();
        }
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

        $(document).on('click', '.btn-like', function(e) {
            e.preventDefault();
            console.log(currentCollection);
            OF.addArtworkToCollection($(this).data('artworkid'), _currentCollectionId).then(function(resp) {
                console.log(resp);
            }).fail(function(err) {
                console.log(err);
            });
        });

        $(document).on('click', '.btn-push--enabled', function(e) {
            var artworkId = $(this).data('artworkid'),
                // get the artwork data from the collection
                artwork = _.find(currentCollection, function(artworkData) {
                    return artworkData.id === artworkId;
                });

            if (artwork && currentFrame) {
                console.log(artwork, currentFrame);
                OF.pushArtwork(currentFrame.id, artwork)
                    .then(function(resp) {
                        console.log(resp);
                        OF.fetchFrames().then(function(data) {
                            console.log(data);
                            allFrames = data.frames;
                            if (currentFrame) {
                                currentFrame = _.find(allFrames, function(frame) {
                                    return currentFrame.id === frame.id;
                                });
                            } else {
                                currentFrame = allFrames[0];
                            }
                            renderFrameDropdown();
                        }).fail(function(err) {
                            console.log(err);
                        });
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

        // when the edit modal appears, populate with artwork
        $('#FrameSettingsModal').on('show.bs.modal', function(event) {
            console.log('currentFrame', currentFrame);
            var modal = $(this),
                frameForForm = Object.assign({}, currentFrame, {
                    name: currentFrame.name,
                    plugins: Object.keys(currentFrame.plugins).join(', '),
                    managers: currentFrame.managers ? currentFrame.managers.map(function(manager) { return manager.username; }).join(', ') : ''
                });
            modal.find('form').fromObject(frameForForm);
        });

        $(document).on('click', '#SaveFrameButton', function(e) {
            e.preventDefault();
            var frame = $('#FrameSettingsForm').getObject(),
                managers = frame.managers.replace(/ /g,'').split(','),
                frameToUpdate = Object.assign(frame, {
                    managers: frame.managers.replace(/ /g,'').split(',')
                });

            OF.updateFrame(frame.id, {name: frame.name})
                .success(function() {
                    OF.updateFrameManagers(frame.id, managers).success(function(resp) {
                        console.log(resp);
                        currentFrame = resp.frame;
                        $('#FrameSettingsModal').modal('hide');
                        renderFrameDropdown();
                    }).error(function(err) {
                        console.log(err);
                    });
                }).error(function(err) {
                    console.log(err);
                });


            // OF.updateFrame(frame.id, frame).then(function(resp) {
            //     $('#FrameSettingsForm').modal('hide');
            // }).fail(function(err) {
            //     $('#FrameSettingsModal .alert').html(err.responseJSON.error.message);
            //     $('#FrameSettingsModal .row-errors').removeClass('hide');
            //     console.log(err);
            // });
        });

        $(document).on('click', '#DeleteFrame', function(e) {
            var frame = $('#FrameSettingsForm').getObject();
            console.log('delete frame!', frame);
            e.preventDefault();
            if(confirm('Are you sure you want to delete this frame? This action cannot be undone.')) {
                OF.deleteFrame(frame.id).then(function() {
                    $('#FrameSettingsModal').modal('hide');
                    removeFrame(frame.id);
                }).fail(function(err) {
                    $('#FrameSettingsModal .alert').html(err.responseJSON.error.message);
                    $('#FrameSettingsModal .row-errors').removeClass('hide');
                });
            }
        });

        $(document).on('click', '#AddButton', function(e) {
            e.preventDefault();
            var artwork = $('#AddForm').getObject();
            OF.addArtwork(artwork).then(function(resp) {
                currentCollection.unshift(resp.artwork);
                renderArtwork(resp.artwork, true);
                $('#AddArtworkModal').modal('hide');
            }).fail(function(err) {
                $('#AddArtworkModal .alert').html(err.responseJSON.error.message);
                $('#AddArtworkModal .row-errors').removeClass('hide');
                console.log(err);
            });
            console.log(artwork);
        });

        // when the edit modal appears, populate with artwork
        $('#EditArtworkModal').on('show.bs.modal', function(event) {
            var button = $(event.relatedTarget),
                artworkId = button.data('artworkid'),
                // get the artwork data from the collection
                artwork = _.find(currentCollection, function(artworkData) {
                    return artworkData.id === artworkId;
                }),
                modal = $(this);
            console.log(artwork);
            modal.find('form').fromObject(artwork);
        });

        $(document).on('click', '#EditButton', function(e) {
            e.preventDefault();
            var artwork = $('#EditForm').getObject();
            OF.updateArtwork(artwork.id, artwork).then(function(resp) {
                replaceArtwork(resp);
                // renderArtwork(resp.artwork, true);
                $('#EditArtworkModal').modal('hide');
            }).fail(function(err) {
                $('#EditArtworkModal .alert').html(err.responseJSON.error.message);
                $('#EditArtworkModal .row-errors').removeClass('hide');
                console.log(err);
            });
            console.log(artwork);
        });

        $(document).on('click', '#DeleteArtwork', function(e) {
            console.log('delete it!');
            var artwork = $('#EditForm').getObject();
            e.preventDefault();
            if(confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
                OF.deleteArtwork(artwork.id).then(function() {
                    $('#EditArtworkModal').modal('hide');
                    removeArtwork(artwork);
                }).fail(function(err) {
                    $('#EditArtworkModal .alert').html(err.responseJSON.error.message);
                    $('#EditArtworkModal .row-errors').removeClass('hide');
                });
            }
        });
    }

    function init() {
        bindEvents();

        OF.fetchFrames().then(function(data) {
            allFrames = data.frames;
            if (currentFrame) {
                currentFrame = _.find(allFrames, function(frame) {
                    return currentFrame.id === frame.id;
                });
            } else {
                currentFrame = allFrames[0];
            }
            renderFrameDropdown();

            switch (window.PATH) {
                case '/stream':
                    OF.fetchStream().then(function(stream) {
                        // collections = [stream.artwork];
                        currentCollection = stream.artwork;
                        renderCollection(currentCollection);
                    }).fail(function(err) {
                        console.log(err);
                    });
                    break;
                case '/' + window.USERNAME:
                    OF.fetchCollection().then(function(data) {
                        console.log(data);
                        currentCollection = data.collection.artwork;
                        renderCollection(currentCollection);
                    }).fail(function(err) {
                        console.log(err);
                    });
                    break;
                default:

            }
        }).fail(function(err) {
            console.log(err);
        });

        OF.fetchUser(true).then(function(user) {
            console.log(user.collections);
            _currentCollectionId = user.collections[0].id;
            _user = user;
        }).fail(function(err) {
            console.log(err);
        });



    }

    init();
});
