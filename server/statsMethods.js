const wrapStatsCall = Meteor.wrapAsync((connection, collection, cb) => {
  connection.collection(collection.name).stats((error, stats) => {
    if(error) {
      cb(null, false);
      // throw new Meteor.Error('stats.collection', error.message);
    } else {
      cb(null, stats);
    }
  });
});

const wrapIndexesCall = Meteor.wrapAsync((connection, collection, cb) => {
  connection.collection(collection.name).listIndexes().toArray((error, stats) => {
    log(error, stats)
    if(error) {
      cb(null, false);
      // throw new Meteor.Error('stats.collection', error.message);
    } else {
      cb(null, stats);
    }
  });
});

Meteor.methods({
  'stats.getCollectionInfo'(collectionId) {
    const collection = Collections.findOne(collectionId);
    const db = MongoHelpers.connectDatabase(collection.database_id);

    const result = {};

    result.stats = wrapStatsCall(db, collection);
    result.indexes = wrapIndexesCall(db, collection);
    db.close();
    return result;
  },

  'stats.fetchCollectionsStats'(databaseId) {
    check(databaseId, String);

    const database = Databases.findOne(databaseId);
    const connection = MongoHelpers.connectDatabase(databaseId);

    database.collections().map(collection => {

      const stats = wrapStatsCall(connection, collection);
      const indexes = [];
      _.each(stats.indexSizes, (value, key) => {
        indexes.push(key);
      });

      Collections.update(collection._id, {$set: {
        stats: {
          size: stats.size,
          documentsCount: stats.count,
          indexes
        }
      }});

    });

    connection.close();

  }
});
