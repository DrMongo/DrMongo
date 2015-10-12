//Meteor.publish(null, () => {
//
//  console.log(Collections);
//  _.each(Collections, (value, key) => {
//    console.log(key);
//    Counts.publish(this, key + '_count', value.find({}), { noReady: true });
//  });
//  return [];
//});

Meteor.publish('connections', () => {
  return Connections.find({});
});

Meteor.publish('collectiones', () => {
  return Collections.find({});
});

Meteor.publish('collection', (name) => {
  return Mongo.Collection.get(name).find({});
});
