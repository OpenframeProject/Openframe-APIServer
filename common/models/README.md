# Migrations

### Export data
`mongodump -u [user] -p [pass] --db ofsl`

### Import data

`mongorestore dump -u [user] -p [pass]`

### Frames

``` js
// Update 'plugins' to 'extensions'
db.Frame.update({}, { $rename: { 'plugins': 'extensions'}}, {multi: 1})

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
```

### Artwork

``` js
db.Artwork.update({}, { $rename: {'plugins': 'required_extensions'}}, {multi: 1})
```