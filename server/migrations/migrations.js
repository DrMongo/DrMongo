
Migrations.add({
  version: 1,
  name: 'Join `host` and `port` fields',
  up: function() {
    Connections.find({}).forEach((connection) => {
      if(!connection.mongoUri) {
        Connections.update(connection._id, {$set: {
          mongoUri: 'mongodb://' + connection.host + ':' + connection.port
        }});
      }
    });
  }
});

Migrations.add({
  version: 2,
  name: 'DRM version collection init',
  up: function() {
    DrmVersion.collection.insert({name: DrmVersion.documentName})
  }
});


Migrations.add({
  version: 3,
  name: 'showFullId set to false',
  up: function() {
    Collections.update({}, {$set: {showFullId: false}}, {multi: true});
  }
});
