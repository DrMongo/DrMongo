Meteor.methods({
  'stats.rawCollectionStats'(collectionId) {
    const collection = Collections.findOne(collectionId);
    const db = connectDatabase(collection.database_id);

    const wrapStatsCall = Meteor.wrapAsync((cb) => {
      db.collection(collection.name).stats((error, stats) => {
        if(error) {
          throw new Meteor.Error('stats.collection', error.message);
        } else {
          cb(null, stats);
        }
      });
    });

    const stats = wrapStatsCall();

    db.close();
    return stats;
  }
});
