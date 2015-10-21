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
  var collection = Collections.findOne(collectionId);
  if (collection) {
    return Mongo.Collection.get(collection.name).find({});
  }
});

Meteor.publish('externalCollection', function(collectionName, selector = {}, options = {}) {
  //log('> externalCollection', collectionName, selector, options);
  let c = Mongo.Collection.get(collectionName);
  return c ? c.find(selector, options) : this.ready();
});
