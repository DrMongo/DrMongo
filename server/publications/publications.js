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

Meteor.publish('documents', (collectionId) => {
  var collection = Collections.findOne(collectionId);
  if (collection) {
    return Mongo.Collection.get(collection.name).find({});
  }
});

Meteor.publish('externalCollection', function (collectionName, selector, options, optionsPaging, randomSeed) {
  log(collectionName, selector, options, optionsPaging)
  if (resemblesId(selector)) {
    selector = eval('("' + selector + '")');
  } else {
    selector = eval('(' + selector + ')');
  }

  let c = Mongo.Collection.get(collectionName);
  if (c) {
    Counts.publish(this, 'documents', c.find(selector, options), {nonReactive: true});
    return c.find(selector, optionsPaging);
  } else {
    this.ready();
  }
});
