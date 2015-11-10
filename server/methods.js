Meteor.methods({
  createCollection(databaseId, collectionName) {
    let database = Databases.findOne(databaseId);
    MongoHelpers.createCollection(database, collectionName);

    // update DR cache
    Collections.insert({
      database_id: databaseId,
      name: collectionName,
      updatedAt: new Date,
      keep: true
    });
  },

  updateConnectionStructure(connectionId) {
    let connection = Connections.findOne(connectionId);
    if (!connection) return false;
    let databases = MongoHelpers.getDatabases(connection);

    Databases.update({connection_id: connectionId}, {$set: {keep: false}}, {multi: true})
    _.each(databases, (databaseName) => {
      Databases.upsert(
        {connection_id: connectionId, name: databaseName},
        {
          $set: {
            updatedAt: new Date,
            keep: true
          }
        }
      );

      let database = Databases.findOne({
        connection_id: connectionId,
        name: databaseName
      });

      Collections.update({database_id: database._id}, {$set: {keep: false}}, {multi: true});
      let collections = MongoHelpers.getCollections(connection, databaseName);
      _.each(collections, (collectionName) => {
        Collections.upsert(
          {database_id: database._id, name: collectionName},
          {
            $set: {
              updatedAt: new Date,
              keep: true
            }
          }
        );
      });
      Collections.remove({database_id: database._id, keep: false});

    });
    Databases.remove({connection_id: connectionId, keep: false});
    return true;
  },
  findCollectionForDocumentId(databaseId, documentId) {
    var db = connectDatabase(databaseId);

    let foundCollection = null;

    var selector = {_id: documentId};

    let collectionNamesWrapper = Meteor.wrapAsync((cb) => {
      db.listCollections().toArray((error, response) => {
        cb(error, response);
      })
    });
    let collections = collectionNamesWrapper();

    var c;
    let collectionFindWrapper = Meteor.wrapAsync((cb) => {
      c.find(selector).toArray((error, response) => {
        cb(error, response);
      })
    });

    _.each(collections, function(collection) {
      if (foundCollection) return false;

      c = db.collection(collection.name);

      let result = collectionFindWrapper();
      if (result.length == 1) foundCollection = collection.name;
    });

    return foundCollection;
  },
  getDocuments(databaseId, collectionName, selector, options, optionsPaging) {
    var db = connectDatabase(databaseId);

    var collection = db.collection(collectionName);

    if (resemblesId(selector)) {
      selector = {_id: selector};
    } else {
      selector = eval('(' + selector + ')');
    }

    let collectionCountWrapper = Meteor.wrapAsync((cb) => {
      collection.find(selector, options.fields || {}).count((error, response) => {
        cb(error, response);
      })
    });

    let docsCount = collectionCountWrapper();

    let docs = collection
      .find(selector, options.fields || {})
      .sort(options.sort || {})
      .skip(optionsPaging.skip || 0)
      .limit(optionsPaging.limit || 0);

    let collectionToArrayWrapper = Meteor.wrapAsync((cb) => {
      docs.toArray((error, response) => {
        cb(error, response);
      })
    });

    docs = collectionToArrayWrapper();

    return {
      docs: docs,
      count: docsCount
    }
  },
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

    var db = connectDatabase(database._id);
    var dbCollection = db.collection(collection.name);

    delete data._id;

    let updateWrapper = Meteor.wrapAsync((cb) => {
      dbCollection.updateOne({_id: documentId}, data, (error, response) => {
        cb(error, response);
      });
    });

    let updatedCount = updateWrapper();
    return updatedCount;
  },
  duplicateDocument(collectionId, documentId) {
    let collection = Collections.findOne(collectionId);
    let database = collection.database();

    var db = connectDatabase(database._id);
    var dbCollection = db.collection(collection.name);

    let findWrapper = Meteor.wrapAsync((cb) => {
      dbCollection.findOne({_id: documentId}, (error, response) => {
        cb(error, response);
      });
    });

    let sourceDocument = findWrapper();
    if (!sourceDocument) return false;

    delete sourceDocument._id;

    let insertWrapper = Meteor.wrapAsync((cb) => {
      dbCollection.insertOne(sourceDocument, (error, response) => {
        cb(error, response);
      });
    });

    let insertResult = insertWrapper();
    return insertResult;
  },
  removeDocument(collectionId, documentId) {
    let collection = Collections.findOne(collectionId);
    let database = collection.database();

    var db = connectDatabase(database._id);
    var dbCollection = db.collection(collection.name);

    let deleteWrapper = Meteor.wrapAsync((cb) => {
      dbCollection.findOneAndDelete({_id: documentId}, (error, response) => {
        cb(error, response);
      });
    });

    let result = deleteWrapper();
    return result;
  },
  changeDatabase() {
    if (Meteor.isServer) {
      //log('exiting')
      //process.exit();
    } else {
      location.reload();
    }
  },
});