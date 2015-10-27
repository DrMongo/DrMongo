let getConnection = (data, cb) => {
  const connection = data.connection;
  const database = data.database || null;
  const url = 'mongodb://' + connection.host + ':' + connection.port + (database ? '/' + database : '');

  MongoInternals.NpmModules.mongodb.module(url, (error, db) => {
    if(error) {
      throw new Error(error.message);
    } else {
      cb(null, db);
    }
  });
};


MongoHelpers = {

  getDatabases(connection) {
    let getConnectionWrapper = Meteor.wrapAsync(getConnection);
    let db = getConnectionWrapper({connection: connection});

    // Use the admin database for the operation
    var adminDb = db.admin();

    // Get all the available databases
    let listDatabasesWrapper = Meteor.wrapAsync(adminDb.listDatabases);
    let databases = listDatabasesWrapper();

    db.close();

    let databaseNames = [];
    _.each(databases.databases, (value) => {
      if (value.name == 'local' || value.name == 'admin') return false;
      databaseNames.push(value.name)
    });
    return databaseNames;
  },

  getCollections(connection, database) {
    let getConnectionWrapper = Meteor.wrapAsync(getConnection);
    let db = getConnectionWrapper({connection: connection, database: database});


    let collectionNamesWrapper = Meteor.wrapAsync((cb) => {
      db.collectionNames((error, response) => {
        cb(error, response);
      })
    });
    let collections = collectionNamesWrapper();

    db.close();
    let collectionNames = [];
    _.each(collections, (value) => {
      if (value.name == 'system.indexes') return false;
      collectionNames.push(value.name)
    });
    return collectionNames;
  },

  createCollection(database, collectionName) {
    let getConnectionWrapper = Meteor.wrapAsync(getConnection);
    let db = getConnectionWrapper({connection: database.connection(), database: database.name});

    let createCollectionWrapper = Meteor.wrapAsync((cb) => {
      db.createCollection(collectionName, (error, response) => {
        cb(null, true);
      });
    });

    let response = createCollectionWrapper();

    return response;
  }

};
