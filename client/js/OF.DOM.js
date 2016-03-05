window.OF.DOM = (function(OF, $) {
    var
        // container elements
        $rowCollection = $('.row-collection'),
        $currentFrame = $('.current-frame'),

        // js templates
        artworkTemplate = _.template($('#ArtworkTemplate').text());
        // menuTemplate = _.template($('#MenuTemplate').text()),
        // currentFrameTemplate = _.template($('#CurrentFrameTemplate')).text(),
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
        opts = opts || {};
        var art = OF.Artwork.getArtworkViewModel(artwork),
            rendered = artworkTemplate(art);
        if (opts.top) {
            $('.tile-item').first().after(rendered);
        } else if (opts.replace) {
            $('*[data-artworkid="' + artwork.id + '"]').replaceWith(rendered);
        } else {
            $rowCollection.append(artworkTemplate(art));
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
                    .then(function(resp) {
                        // OF.API.fetchFrames().then(function(data) {
                        //     OF.Frames.framesList = data.frames;
                        // }).fail(function(err) {
                        //     console.log(err);
                        // });
                    })
                    .fail(function(err) {
                        console.log(err);
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
                    removeArtwork(artwork);
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

    }

    function bindFrameEvents() {
        // when the edit modal appears, populate with artwork
        $('#FrameSettingsModal').on('show.bs.modal', function(event) {
            var currentFrame = OF.Frames.getCurrentFrame(),
                modal = $(this),
                frameForForm = Object.assign({}, currentFrame, {
                    name: currentFrame.name,
                    plugins: Object.keys(currentFrame.plugins).join(', '),
                    managers: currentFrame.managers ? currentFrame.managers.map(function(manager) {
                        return manager.username;
                    }).join(', ') : ''
                });
            modal.find('form').fromObject(frameForForm);
        });

        // Save the frame settings
        $(document).on('click', '#SaveFrameButton', function(e) {
            e.preventDefault();
            var frame = $('#FrameSettingsForm').getObject(),
                managers = frame.managers.replace(/ /g, '').split(',');

            OF.API.updateFrame(frame.id, {
                name: frame.name
            }).success(function() {
                OF.API.updateFrameManagers(frame.id, managers).success(function(resp) {
                    $('#FrameSettingsModal').modal('hide');
                });
            }).fail(function(err) {
                $('#FrameSettingsModal .alert').html(err.responseJSON.error.message);
                $('#FrameSettingsModal .row-errors').removeClass('hide');
            });

        });

        $(document).on('click', '#DeleteFrame', function(e) {
            e.preventDefault();
            var frame = $('#FrameSettingsForm').getObject();
            if (confirm('Are you sure you want to delete this frame? This action cannot be undone.')) {
                OF.API.deleteFrame(frame.id).then(function() {
                    $('#FrameSettingsModal').modal('hide');
                }).fail(function(err) {
                    $('#FrameSettingsModal .alert').html(err.responseJSON.error.message);
                    $('#FrameSettingsModal .row-errors').removeClass('hide');
                });
            }
        });
    }

    //
    //== END FRAMES
    //

    //
    //== MENU
    //

    function showMenu() {

    }

    function hideMenu() {

    }

    function renderMenu() {

    }

    function bindMenuEvents() {

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

        OF.Artwork.loadArtwork().then(function(artwork) {
            renderArtworks(artwork);
        });
    }

    return {
        init: init
    };

})(OF, jQuery);