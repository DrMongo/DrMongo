Meteor.methods({
  updateDocument(collectionId, documentId, data) {
    log(collectionId, documentId);
    let collection = Collections.findOne(collectionId);
    let database = collection.database();
    let connection = database.connection();
    if (!connection || !database || !collection) return false;

    delete data._id;
    return Mongo.Collection.get(collection.name).update(documentId, data);

  },
  duplicateDocument(collectionId, documentId) {
    log(collectionId, documentId);
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
  }
});
