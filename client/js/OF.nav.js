window.OF.nav = (function() {
    var self = {
        fetchUser: function() {
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
            });
        },

        fetchCollectionById: function(id) {
            return $.get('/api/users/' + window.USER_ID + '/collections/' + id, {
                'filter': {
                    'include': [
                        'artwork'
                    ]
                }
            });
        },

        fetchAllFrames: function() {
            console.log('fetchFrames');
            return $.get('/api/users/' + window.USER_ID + '/all_frames');
        },

        pushArtwork: function(frameId, artworkData) {
            return $.ajax({
                url: '/api/frames/' + frameId + '/current_artwork',
                method: 'PUT',
                data: artworkData
            });
        }
    };

    return self;
})();
