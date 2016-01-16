Meteor.publish(null, () => {
  return [
    Connections.find(),
    Settings.find()
  ];
});

Meteor.publish('layoutData', (connectionSlug, databaseName, collectionName) => {
  check(connectionSlug, Match.OneOf(String, null));
  check(databaseName, Match.OneOf(String, null));
  check(collectionName, Match.OneOf(String, null));

  log(connectionSlug, databaseName, collectionName);
  let connectionsSelector = null;
  let databasesSelector = null;
  let collectionsSelector = null;

  let connection, database, collection;
  if (connectionSlug) {
    connection = Connections.findOne({slug: connectionSlug});
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


Meteor.publish('databases', function(connectionSlug) {
  check(connectionSlug, String);

  const connection = Connections.findOne({slug: connectionSlug});

  return [
    Connections.find(connection._id),
    Databases.find({connection_id: connection._id})
  ]
});
