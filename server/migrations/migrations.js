
Migrations.add({
  version: 1,
  name: 'Join `host` and `port` fields',
  up: function() {
    Connections.find({}).forEach((connection) => {
      Connections.update(connection._id, {$set: {
        mongoUri: 'mongodb://' + connection.host + ':' + connection.port
      }});
    });
  }
});
