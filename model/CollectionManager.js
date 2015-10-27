class CollectionManager {

  constructor() {
    this.collectionsNames = [];
  }

  mountAllCollections(database) {
    var mountedCollections = {};

    this._unmountCollections();

    Collections.find({database_id: database._id}).forEach((collection) => {
      mountedCollections[collection._id] = new Mongo.Collection(collection.name);
      this.collectionsNames.push(collection.name);
    });

    Meteor.call('mountAllCollections', database._id);
    return mountedCollections;
  }

  mountAllCollectionsOnServer(databaseId) {
    if (Meteor.isServer) {
      let database = Databases.findOne(databaseId);
      let connection = database.connection();
      if (!connection || !database) return false;

      //this._unmountCollections(Meteor.server, database.collections());
      //log('>', Meteor.server);

      let driver = new MongoInternals.RemoteCollectionDriver('mongodb://' + connection.host + ':' + connection.port + '/' + database.name);

      Collections.find({database_id: database._id}).forEach((collection) => {
        if (!Mongo.Collection.get(collection.name)) {
          new Mongo.Collection(collection.name, {_driver: driver});
        }
      })
    }
  }

  _unmountCollections() {
    _.each(this.collectionsNames, (value) => {
      delete Meteor.connection._stores[value];
      delete Meteor.connection._methodHandlers['/'+value+'/insert'];
      delete Meteor.connection._methodHandlers['/'+value+'/remove'];
      delete Meteor.connection._methodHandlers['/'+value+'/update'];
    });
    this.collectionsNames = [];
  }

}

cm = new CollectionManager();
