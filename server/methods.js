Meteor.methods({
  createCollection(databaseId, collectionName) {
    let database = Databases.findOne(databaseId);
    MongoHelpers.createCollection(database, collectionName);

    // update DR cache
    return Collections.insert({
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

    Connections.clearAllRelations(connection);

    Databases.update({connection_id: connectionId}, {$set: {keep: false}}, {multi: true});
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

    db.close();
    return foundCollection;
  },
  getDocuments(databaseId, collectionName, filter, pagination) {
    pagination = pagination || 0;

    var db = connectDatabase(databaseId);
    var collection = db.collection(collectionName);

    var collectionInfo = Collections.findOne({database_id: databaseId, name: collectionName});
    collectionInfo.paginationLimit = collectionInfo.paginationLimit || 20;

    if (!collectionInfo) return false;

    if (resemblesId(filter)) {
      var selector = {_id: filter};
      var options = {};
    } else {
      try {
        filter = eval('([' + filter + '])');
      }

      catch(error) {
        return false;
      }

      var selector = filter[0] || {};
      var options = filter[1] || {};
    }

    let collectionCountWrapper = Meteor.wrapAsync((cb) => {
      collection.find(selector, options).count((error, response) => {
        cb(error, response);
      })
    });

    let docsCount = collectionCountWrapper();

    if (!options.skip) {
      options.skip = pagination * collectionInfo.paginationLimit;
    }
    if (!options.limit) {
      options.limit = collectionInfo.paginationLimit;
    }

    let docs = collection
      .find(selector, options.fields || {})
      .sort(options.sort || {})
      .skip(options.skip || 0)
      .limit(options.limit || 0);

    let collectionToArrayWrapper = Meteor.wrapAsync((cb) => {
      docs.toArray((error, response) => {
        cb(error, response);
      })
    });

    docs = collectionToArrayWrapper();

    db.close();
    return {
      docs: docs,
      count: docsCount
    }
  },
  insertDocument(collectionId, data) {
    let collection = Collections.findOne(collectionId);
    let database = collection.database();

    var db = connectDatabase(database._id);
    var dbCollection = db.collection(collection.name);

    let insertWrapper = Meteor.wrapAsync((cb) => {
      dbCollection.insertOne(data, (error, response) => {
        cb(error, response);
      });
    });

    let insertResult = insertWrapper();
    db.close();

    return insertResult;
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
    db.close();

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

    sourceDocument._id = Random.id();

    let insertWrapper = Meteor.wrapAsync((cb) => {
      dbCollection.insertOne(sourceDocument, (error, response) => {
        cb(error, response);
      });
    });

    insertWrapper();
    db.close();

    return;
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
    db.close();

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
