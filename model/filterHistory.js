FilterHistory = new Mongo.Collection(dr.collectionNamePrefix + 'filterHistory');

FilterHistory.after.insert(function(userId, doc) {
  FilterHistory.find({name: null}, {sort: {createdAt: -1}, skip: 100}).forEach(function(item) {
    FilterHistory.remove(item._id);
  });
});

FilterHistory.allow({
  insert: function() {return true;},
  update: function() {return true;},
  remove: function() {return true;}
});
