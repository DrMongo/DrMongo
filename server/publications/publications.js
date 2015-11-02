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
