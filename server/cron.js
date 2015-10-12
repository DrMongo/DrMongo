SyncedCron.config({
  // Log job run details to console
  log: true,

  // Use a custom logger function (defaults to Meteor's logging package)
  //logger: null,

  // Name of collection to use for synchronisation and logging
  collectionName: 'cronHistory',

  // Default to using localTime
  utc: false,

  /*
   TTL in seconds for history records in collection to expire
   NOTE: Unset to remove expiry but ensure you remove the index from
   mongo by hand

   ALSO: SyncedCron can't use the `_ensureIndex` command to modify
   the TTL index. The best way to modify the default value of
   `collectionTTL` is to remove the index by hand (in the mongo shell
   run `db.cronHistory.dropIndex({startedAt: 1})`) and re-run your
   project. SyncedCron will recreate the index with the updated TTL.
   */
  collectionTTL: 172800
});


SyncedCron.add({
  name: 'Fetch collection names',
  schedule: function(parser) {
    return parser.text('every 1000 seconds');
  },
  job: function() {
    let helpers = new MongoHelpers;
    let names = helpers.collectionNames();
    _.each(names, (value) => {
      CollectionNames.upsert(
        {connection: 'default', name: value.name},
        {$set: {
          updatedAt: new Date
        }}
      );
    });
  }
});


SyncedCron.start();
