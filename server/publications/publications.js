//Meteor.publish(null, () => {
//
//  console.log(Collections);
//  _.each(Collections, (value, key) => {
//    console.log(key);
//    Counts.publish(this, key + '_count', value.find({}), { noReady: true });
//  });
//  return [];
//});

Meteor.publish('connectionStructure', () => {
  return [
    Connections.find({}),
    Databases.find({}),
    Collections.find({}),
    FilterHistory.find({})
  ];
});


Meteor.publish('layoutData', (connectionSlug, databaseName, collectionName) => {
  check(connectionSlug, Match.OneOf(String, null));
  check(databaseName, Match.OneOf(String, null));
  check(collectionName, Match.OneOf(String, null));

  log('> layoutData', connectionSlug, databaseName, collectionName);
  let connectionsSelector = null;
  let databasesSelector = null;
  let collectionsSelector = null;

  let connection, database, collection;
  if (connectionSlug) {
    connection = Databases.findOne({slug: connectionSlug});
    if(connection) {
      connectionsSelector = {_id: connectionSlug};

      if (databaseName) {
        database = Databases.findOne({connection_id: connection._id, name: databaseName});
        if(database) {
          databasesSelector = {_id: database._id};

          if (collectionName) {
            collection = Collections.findOne({database_id: database._id, name: collectionName});
            if(collection) {
              collectionsSelector = {_id: collection._id};
            }
          }
        }
      }
    }
  }

  log('> selectors', connectionsSelector, databasesSelector, collectionsSelector);
  const publish = [];
  if(connectionsSelector) publish.push(Connections.find(connectionsSelector));
  if(databasesSelector) publish.push(Databases.find(databasesSelector));
  if(collectionsSelector) publish.push(Collections.find(collectionsSelector));

  return publish;
});


Meteor.publish('navigationData', (connectionId, databaseId) => {
  check(connectionId, Match.OneOf(String, null));
  check(databaseId, Match.OneOf(String, null));

  let databasesSelector = null;
  let collectionsSelector = null;

  if(connectionId) {
    databasesSelector = {connection_id: connectionId};
  }

  if(databaseId) {
    collectionsSelector = {database_id: databaseId};
  }

  const publish = [];
  publish.push(Connections.find({}));
  if(databasesSelector) publish.push(Databases.find(databasesSelector));
  if(collectionsSelector) publish.push(Collections.find(collectionsSelector));

  return publish;
});

Meteor.publish('filterHistory', function(filterId) {
  check(filterId, String);

  return FilterHistory.find(filterId);
});
