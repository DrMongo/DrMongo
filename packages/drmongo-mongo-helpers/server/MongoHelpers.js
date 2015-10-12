MongoHelpers = class MongoHelpers {

  collectionNames() {
    let Future = Meteor.npmRequire('fibers/future');
    let futureDb = new Future;

    MongoInternals.NpmModules.mongodb.module("mongodb://127.0.0.1:27017/db1", Meteor.bindEnvironment((err, db) => {
      futureDb.return(db);
    }));

    let futureCollections = new Future;
    let db = futureDb.wait();

    db.collectionNames(Meteor.bindEnvironment(function(err, collections) {
      futureCollections.return(collections);
    }));

    let collections = futureCollections.wait();

    return _.filter(collections, (value) => { return value.name != 'system.indexes'});
  }

};
