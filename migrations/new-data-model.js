db.Frame.update({}, { $rename: { 'plugins': 'extensions'}}, {multi: 1});

db.Frame.find().snapshot().forEach(
    function (elem) {
        if (elem._current_artwork) {
            db.Frame.update(
                {
                    _id: elem._id
                },
                {
                    $set: {
                        currentArtworkId: elem._current_artwork.id
                    },
                    $unset: {
                        _current_artwork: 1,
                        current_artwork: 1
                    }
                }
            );
        }
    }
);

db.Artwork.update({}, { $rename: {'plugins': 'required_extensions'}}, {multi: 1});