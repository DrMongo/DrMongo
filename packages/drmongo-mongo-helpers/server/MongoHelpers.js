// mongo db 1.4 doc, http://mongodb.github.io/node-mongodb-native/1.4/contents.html
// mongo db 2.2 doc, http://mongodb.github.io/node-mongodb-native/2.2/api

let getConnection = (data, cb) => {
  const uri = MongodbUriParser.parse(data.connection.mongoUri);
  if(data.options.database) {
    uri.database = data.options.database
  }
  const mongoUri = MongodbUriParser.format(uri);

  log('> connecting to: ' + mongoUri);

  var MongoClient = MongoInternals.NpmModules.mongodb.module.MongoClient;
  log('> Connection options: ', data.options)
  
  MongoClient.connect(mongoUri, data.options, (error, db) => {
    if(error) {
      cb(error, null);
    } else {
      cb(null, db);
    }
  });
};


MongoHelpers = {

  getDatabases(connection) {
    // Use the admin database for the operation
    var mongoUriParsed = MongodbUriParser.parse(connection.mongoUri);
    console.log(mongoUriParsed)
    var authSource = mongoUriParsed.options ? mongoUriParsed.options.authSource : null;

    let db = MongoHelpers.connect(connection, {authSource: authSource});
    if (!db) return false;


    var adminDb = db.admin();

    // Get all the available databases
    let listDatabasesWrapper = Meteor.wrapAsync((cb) => {
      adminDb.listDatabases().then((result) => cb(null, result))
    });
    let databases = listDatabasesWrapper();
    log('DATABASES', databases);

    let databasesList;
    if(databases.ok === 0) {
      if(databases.code === 13 && connection.database) {
        databasesList = [{name: connection.database}]
      } else {
        throw new Meteor.Error(databases.code, databases.errmsg);
      }
    } else {
      databasesList = databases.databases;
    }

    db.close();

    let databaseNames = [];
    _.map(databasesList, (value) => {
      if (value.name === 'local' || value.name === 'admin') return false;
      databaseNames.push(value.name)
    });

    return databaseNames;
  },

  getCollections(connection, database) {
    let db = MongoHelpers.connect(connection, database);
    if (!db) return false;

    let collectionNamesWrapper = Meteor.wrapAsync((cb) => {
      db.collections((error, response) => {
        cb(error, response);
      })
    });
    let collections = collectionNamesWrapper();

    db.close();
    let collectionNames = [];
    collections.map(value => {
      if (value.name === 'system.indexes') return false;
      collectionNames.push(value.s.name)
    });

    return collectionNames;
  },

  createCollection(database, collectionName) {
    let db = MongoHelpers.connect(database.connection(), database.name);
    if (!db) return false;

    let createCollectionWrapper = Meteor.wrapAsync((cb) => {
      db.createCollection(collectionName, (error, response) => {
        cb(null, true);
      });
    });

    let response = createCollectionWrapper();

    db.close();
    return response;
  },

  connect(connection, options) {
    if (_.isString(options)) {
      options = {
        database: options
      }
    }
    const getConnectionWrapper = Meteor.wrapAsync(getConnection);
    try {
      var result = getConnectionWrapper({connection, options});
    }
    catch(error) {
      log('ERROR: ' + JSON.stringify(error))
      var result = false;
    }
    return result;
  },

  connectDatabase(databaseId) {
    const database = Databases.findOne(databaseId);
    return MongoHelpers.connect(database.connection(), database.name);
  }

};
