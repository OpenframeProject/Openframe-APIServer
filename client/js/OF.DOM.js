window.OF.DOM = (function(OF, $) {
    var
        // container elements
        $rowCollection = $('.row-collection'),
        $currentFrame = $('.current-frame'),
        $frameMenuList = $('#MenuFrameList'),

        // js templates
        artworkTpl = _.template($('#ArtworkTemplate').text()),
        frameMenuItemTpl = _.template($('#FrameMenuItem').text()),
        currentFrameTpl = _.template($('#CurrentFrameTemplate').text());
        // framesDropdownTemplate = _.template($('#FramesDropdownTemplate').text());


    function bindGeneralEvents() {
        // whenever a modal opens, clear errors
        $('.modal').on('show.bs.modal', function() {
            var modal = $(this);
            modal.find('.alert').html('');
            modal.find('.row-errors').addClass('hide');
        });

        $(window).scroll(function() {
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                OF.Artwork.loadNextPage().then(function(artworks) {
                    renderArtworks(artworks);
                });
            }
        });
    }

    function displayErrors($el, err) {
        $el.find('.alert').html(err.responseJSON.error.message);
        $el.find('.row-errors').removeClass('hide');
    }

    function clearErrors($el) {
        $el.find('.alert').html('');
        $el.find('.row-errors').addClass('hide');
    }

    //
    //== ARTWORK
    //

    // render artworks to screen
    function renderArtworks(artworks) {
        console.log('renderArtworks', artworks);
        if (!artworks || !artworks.length) return;
        artworks.forEach(function(artwork) {
            renderArtwork(artwork);
        });
    }

    function renderArtwork(artwork, opts) {
        if (!artwork || !artwork.id) {
            return;
        }
        opts = opts || {};
        var art = OF.Artwork.getArtworkViewModel(artwork),
            rendered = artworkTpl(art);

        if (opts.top) {
            $('.tile-item').first().after(rendered);
        } else if (opts.replace) {
            $('*[data-artworkid="' + artwork.id + '"]').replaceWith(rendered);
        } else {
            $rowCollection.append(artworkTpl(art));
        }
    }

    function clearCurrentArtwork() {
        var artworkId = $('.tile-artwork--current').data('artworkid'),
            artwork = OF.Artwork.findArtworkById(artworkId);
        if (artwork) {
            renderArtwork(artwork, {replace: true});
        }
    }

    /**
     * Remove artwork tile from DOM
     * @param  {String} artworkId
     */
    function removeArtwork(artworkId) {
        $('*[data-artworkid="' + artworkId + '"]').remove();
    }

    function bindArtworkEvents() {
        // handle like button click
        $(document).on('click', '.btn-like', function(e) {
            e.preventDefault();
            $(this).removeClass('btn-like').addClass('btn-unlike');
            OF.API.likeArtwork($(this).data('artworkid')).fail(function(resp) {
                $(this).removeClass('btn-unlike').addClass('btn-like');
            });
        });

        // handle unlike button click
        $(document).on('click', '.btn-unlike', function(e) {
            e.preventDefault();
            $(this).removeClass('btn-unlike').addClass('btn-like');
            OF.API.unlikeArtwork($(this).data('artworkid')).fail(function(resp) {
                $(this).removeClass('btn-like').addClass('btn-unlike');
            });
        });

        // handle push click
        $(document).on('click', '.btn-push--enabled', function(e) {
            var artworkId = $(this).data('artworkid'),
                // get the artwork data from the collection
                artwork = OF.Artwork.findArtworkById(artworkId),
                currentFrame = OF.Frames.getCurrentFrame(),
                currentArtwork = OF.Frames.getCurrentArtwork();

            if (artwork && currentFrame) {
                OF.API.pushArtwork(currentFrame.id, artwork)
                    .then(function(pushedArtwork) {
                        // db updated... reload frames
                        console.log(pushedArtwork);
                        OF.API.fetchFrames().then(function(data) {
                            var frames = OF.Frames.setFramesList(data.frames);
                            renderCurrentFrame();
                            renderMenu();
                            if (currentArtwork) {
                                renderArtwork(currentArtwork, {replace: true});
                            }
                            renderArtwork(pushedArtwork, {replace: true});
                        });
                    });
            }
        });

        // when the add modal appears, reset it
        $('#AddArtworkModal').on('show.bs.modal', function(event) {
            var modal = $(this);
            modal.find('form')[0].reset();
        });

        $(document).on('click', '#AddButton', function(e) {
            e.preventDefault();
            var artwork = $('#AddArtworkForm').getObject();
            OF.API.addArtwork(artwork).then(function(resp) {
                OF.Artwork.prependToArtworkList(resp);
                renderArtwork(resp, {top: true});
                $('#AddArtworkModal').modal('hide');
            }).fail(function(err) {
                displayErrors($('#AddArtworkModal'), err);
            });
        });

        // when the edit modal appears, populate with artwork
        $('#EditArtworkModal').on('show.bs.modal', function(event) {
            var button = $(event.relatedTarget),
                artworkId = button.data('artworkid'),
                artwork = OF.Artwork.findArtworkById(artworkId),
                $modal = $(this);
            clearErrors($modal);
            $modal.find('form').fromObject(artwork);
        });

        $(document).on('click', '#EditButton', function(e) {
            e.preventDefault();
            var artwork = $('#EditForm').getObject();
            OF.API.updateArtwork(artwork.id, artwork).then(function(resp) {
                $('#EditArtworkModal').modal('hide');
                OF.Artwork.updateArtworkById(artwork.id, resp);
                renderArtwork(resp, {replace: true});
            }).fail(function(err) {
                displayErrors($('#EditArtworkModal'), err);
            });
        });

        // handle click on delete artwork link
        $(document).on('click', '#DeleteArtwork', function(e) {
            e.preventDefault();
            var artwork = $('#EditForm').getObject();
            if (confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
                OF.API.deleteArtwork(artwork.id).then(function() {
                    $('#EditArtworkModal').modal('hide');
                    removeArtwork(artwork.id);
                }).fail(function(err) {
                    displayErrors($('#EditArtworkModal'), err);
                });
            }
        });
    }
    //
    //== END ARTWORK
    //


    //
    //== FRAMES
    //

    function renderCurrentFrame() {
        if (!OF.Frames.getCurrentFrame()) return;
        var curFrameVM = OF.Frames.getCurrentFrameViewModel();
        $currentFrame.html(currentFrameTpl(curFrameVM));
    }

    function bindFrameEvents() {
        $(document).on('click', '.sidebar__row--frame', function(e) {
            var frameId = $(this).data('frameid'),
                currentArtwork;

            // set current frame
            OF.Frames.setCurrentFrameById(frameId);

            clearCurrentArtwork();

            // update frame UIs
            renderCurrentFrame();
            renderMenu();
            hideMenu();

            // update artwork UIs
            currentArtwork = OF.Frames.getCurrentArtwork();
            renderArtwork(currentArtwork, {replace: true});
        });

        // when the settings modal appears, populate with frame info
        $('#FrameSettingsModal').on('show.bs.modal', function(event) {
            var button = $(event.relatedTarget),
                frameId = button.data('frameid'),
                frame = OF.Frames.findFrameById(frameId),
                $modal = $(this),
                frameForForm = Object.assign({}, frame, {
                    name: frame.name,
                    plugins: Object.keys(frame.plugins).join(', '),
                    managers: frame.managers ? frame.managers.map(function(manager) {
                        return manager.username;
                    }).join(', ') : ''
                });
            $modal.find('form').fromObject(frameForForm);
        });

        // Save the frame settings
        $(document).on('click', '#SaveFrameButton', function(e) {
            e.preventDefault();
            var frame = $('#FrameSettingsForm').getObject(),
                managers = frame.managers.replace(/ /g, '').split(',');

            OF.API.updateFrame(frame.id, {
                name: frame.name
            }).success(function() {
                OF.API.updateFrameManagers(frame.id, managers).then(function(resp) {
                    OF.Frames.updateFrameById(frame.id, resp.frame);
                    $('#FrameSettingsModal').modal('hide');
                    renderMenu();
                    renderCurrentFrame();
                });
            }).fail(function(err) {
                displayErrors($('#FrameSettingsModal'), err);
            });
        });

        $(document).on('click', '#DeleteFrame', function(e) {
            e.preventDefault();
            var frame = $('#FrameSettingsForm').getObject();
            if (confirm('Are you sure you want to delete this frame? This action cannot be undone.')) {
                OF.API.deleteFrame(frame.id).then(function() {
                    OF.Frames.removeFrameById(frame.id);
                    $('#FrameSettingsModal').modal('hide');
                    renderMenu();
                    renderCurrentFrame();
                }).fail(function(err) {
                    $('#FrameSettingsModal .alert').html(err.responseJSON.error.message);
                    $('#FrameSettingsModal .row-errors').removeClass('hide');
                });
            }
        });
    }

    function updateFrames(currentId) {
        OF.API.fetchFrames().then(function(data) {
            var frames = OF.Frames.setFramesList(data.frames);
            if (currentId) {
                OF.Frames.setCurrentFrameById(currentId);
            }

            // TODO - refactor this into a 'handleFrameUpdate' method for better reuse
            clearCurrentArtwork();
            renderCurrentFrame();
            renderMenu();
            // update artwork UIs
            var currentArtwork = OF.Frames.getCurrentArtwork();
            renderArtwork(currentArtwork, {replace: true});
        });
    }

    //
    //== END FRAMES
    //

    //
    //== MENU
    //

    function showMenu() {
        console.log('showMenu');
        $('.sidebar').addClass('sidebar--open');
    }

    function hideMenu() {
        console.log('hideMenu');
        $('.sidebar').removeClass('sidebar--open');
    }

    function renderMenu() {
        var frames = OF.Frames.getFramesList();
        // empty the list
        $frameMenuList.empty();
        // render each frame list item
        frames.forEach(function(frame) {
            var frameVM = OF.Frames.getFrameViewModel(frame);
            $frameMenuList.append(frameMenuItemTpl(frameVM));
        });
    }

    function bindMenuEvents() {
        $('.navbar-btn-item--menu').on('click', function() {
            console.log('clicked menu button');
            showMenu();
        });

        $(document).on('click', '.btn-menu-close', function() {
            hideMenu();
        });
    }

    //
    //== END MENU
    //

    function init() {
        console.log('OF.DOM.init()');
        bindGeneralEvents();
        bindFrameEvents();
        bindArtworkEvents();
        bindMenuEvents();

        // frames have already loaded in OF.init(), render them now
        renderCurrentFrame();

        renderMenu();

        OF.Artwork.loadArtwork().then(function(artwork) {
            renderArtworks(artwork);
        });
    }

    return {
        init: init,
        updateFrames: updateFrames
    };

})(OF, jQuery);