class CollectionManager {
  constructor() {
    this.collections = {}
  }

  mountAllCollections(database) {
    var mountedCollections = {};
    Collections.find({database_id: database._id}).forEach((collection) => {
      MountedCollections[collection._id] = new Mongo.Collection(collection.name);
    })
    Meteor.call('mountAllCollections', database._id);
    this.collections = MountedCollections
    return MountedCollections;
  }

  mountAllCollectionsOnServer(databaseId) {
    if (Meteor.isServer) {
      let database = Databases.findOne(databaseId);
      let connection = database.connection();
      if (!connection || !database) return false;

      let driver = new MongoInternals.RemoteCollectionDriver('mongodb://' + connection.host + ':' + connection.port + '/' + database.name);

      Collections.find({database_id: database._id}).forEach((collection) => {
        if (!Mongo.Collection.get(collection.name)) {
          new Mongo.Collection(collection.name, {_driver: driver});
        }
      })
    }
  }

}

cm = new CollectionManager();
