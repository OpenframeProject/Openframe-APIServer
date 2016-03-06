window.OF = (function() {
    function init() {
        console.log('OF.init()');


        FastClick.attach(document.body);

        // Start by fetching the user's frames
        OF.API.fetchFrames().then(function(data) {
            var frames = OF.Frames.setFramesList(data.frames);

            // user has no frames! show notice
            if (frames.length < 1) {
                $('.row-notice').removeClass('hide');
            }

            // init submodules
            OF.DOM.init();
            OF.PubSub.init();

        }).fail(function(err) {
            console.log(err);
        });
    }

    return {
        init: init
    };
})();
