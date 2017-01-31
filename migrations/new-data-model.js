//
// FRAMES
//

// Rename plugins to extensions
db.Frame.update({}, { $rename: { 'plugins': 'extensions'}}, {multi: 1});

// Replace embedded current artwork with a relationship
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

// Rename plugins to required_extensions
db.Artwork.update({}, { $rename: {'plugins': 'required_extensions'}, $unset: {aspect_mode: 1, format_other: 1, passwordConfirm: 1}}, {multi: 1});

// Use https for artworks on BOS
db.Artwork.find({url: /http:\/\/thebookofshaders\.com.*/}).forEach(function(e,i) {
    e.url=e.url.replace("http://","https://");
    db.Artwork.save(e);
});

// Use https for preview images on BOS
db.Artwork.find({thumb_url: /http:\/\/thebookofshaders\.com.*/}).forEach(function(e,i) {
    e.thumb_url=e.thumb_url.replace("http://","https://");
    db.Artwork.save(e);
});

// Make sure existing users are marked as 'verified'
db.OpenframeUser.update({}, {$set: {emailVerified: true}}, {multi: 1});