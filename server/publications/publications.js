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
    Collections.find({})
  ];
});

Meteor.publish('documents', (collectionId) => {
  console.log(collectionId)
  var collection = Collections.findOne(collectionId);
  if (collection) {
    console.log(Mongo.Collection.get(collection.name).find({}).count())
    return Mongo.Collection.get(collection.name).find({});
  }
});
