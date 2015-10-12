//Meteor.publish(null, () => {
//
//  console.log(Collections);
//  _.each(Collections, (value, key) => {
//    console.log(key);
//    Counts.publish(this, key + '_count', value.find({}), { noReady: true });
//  });
//  return [];
//});

Meteor.publish('collectionNames', () => {
  return CollectionNames.find({});
});

Meteor.publish('collection', (name) => {
  return Mongo.Collection.get(name).find({});
});
