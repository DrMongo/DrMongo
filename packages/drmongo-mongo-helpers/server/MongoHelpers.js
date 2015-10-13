MongoHelpers = {

  getDatabases(connection) {
    let Future = Meteor.npmRequire('fibers/future');
    let futureDb = new Future;

    MongoInternals.NpmModules.mongodb.module('mongodb://' + connection.host + ':' + connection.port, Meteor.bindEnvironment((err, db) => {
      futureDb.return(db);
    }));

    let futureDatabases = new Future;
    let db = futureDb.wait();


    // Use the admin database for the operation
    var adminDb = db.admin();
    console.log(adminDb);
    // List all the available databases
    adminDb.listDatabases(function (err, dbs) {
      futureDatabases.return(dbs.databases);
    });

    let databases = futureDatabases.wait();

    db.close();
    let databaseNames = [];
    _.each(databases, (value) => {
      if (value.name == 'local' || value.name == 'admin') return false;
      databaseNames.push(value.name)
    });
    return databaseNames;
  },

  getCollections(connection, database) {
    let Future = Meteor.npmRequire('fibers/future');
    let futureDb = new Future;

    MongoInternals.NpmModules.mongodb.module('mongodb://' + connection.host + ':' + connection.port + '/' + database, Meteor.bindEnvironment((err, db) => {
      futureDb.return(db);
    }));

    let futureCollections = new Future;
    let db = futureDb.wait();

    db.collectionNames(Meteor.bindEnvironment(function (err, collections) {
      futureCollections.return(collections);
    }));

    let collections = futureCollections.wait();

    db.close();
    let collectionNames = [];
    _.each(collections, (value) => {
      if (value.name == 'system.indexes') return false;
      collectionNames.push(value.name)
    });
    return collectionNames;
  }

};
