Meteor.methods({
  insertDocument(collectionId, data) {
    let collection = Collections.findOne(collectionId);
    let database = collection.database();
    let connection = database.connection();
    if (!connection || !database || !collection) return false;

    return Mongo.Collection.get(collection.name).insert(data);

  },
  updateDocument(collectionId, documentId, data) {
    let collection = Collections.findOne(collectionId);
    let database = collection.database();
    let connection = database.connection();
    if (!connection || !database || !collection) return false;

    delete data._id;
    return Mongo.Collection.get(collection.name).update(documentId, data);
  },
  duplicateDocument(collectionId, documentId) {
    let collection = Collections.findOne(collectionId);
    let database = collection.database();
    let connection = database.connection();
    if (!connection || !database || !collection) return false;


    let data = Mongo.Collection.get(collection.name).findOne(documentId);
    if (!data) return false;

    delete data._id;
    return Mongo.Collection.get(collection.name).insert(data);
  },
  removeDocument(collectionId, documentId) {
    log(collectionId, documentId);
    let collection = Collections.findOne(collectionId);
    let database = collection.database();
    let connection = database.connection();
    if (!connection || !database || !collection) return false;

    return Mongo.Collection.get(collection.name).remove(documentId);
  },
  changeDatabase() {
    if (Meteor.isServer) {
      log('exiting')
      process.exit();
    } else {
      location.reload();
    }
  },
  mountCollections(databaseId) {
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
});
