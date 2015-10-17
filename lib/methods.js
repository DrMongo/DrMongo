Meteor.methods({
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

  }
});
