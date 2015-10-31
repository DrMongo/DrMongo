Collections = new Mongo.Collection(dr.collectionNamePrefix + 'collections');


Collections.allow({
  insert: function() {return true;},
  update: function() {return true;},
  remove: function() {return true;}
});

Collections.helpers({
  icon() {
    return Icons.forCollection(this.name);
  },

  database() {
    return Databases.findOne(this.database_id);
  },

  className() {
    return s(this.name).classify().value();
  }
});
