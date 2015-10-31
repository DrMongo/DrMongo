Connections = new Mongo.Collection(dr.collectionNamePrefix + 'connections');

Connections.allow({
  insert: function() {return !dr.isDemo;},
  update: function() {return !dr.isDemo;},
  remove: function() {return !dr.isDemo;}
});

Connections.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (fieldNames.indexOf('host') > -1 || fieldNames.indexOf('port') > -1) {
    Databases.find({connection_id: doc._id}).forEach(function(database) {
      Collections.remove({database_id: database._id});
    });
    Databases.remove({connection_id: doc._id});
  }
});

Connections.after.remove(function(userId, doc) {
  Databases.find({connection_id: doc._id}).forEach(function(database) {
    Collections.remove({database_id: database._id});
  });
  Databases.remove({connection_id: doc._id});
});

Connections.friendlySlugs(
  {
    slugFrom: 'name',
    slugField: 'slug',
    distinct: true,
    updateSlug: true
  }
);

Connections.helpers({
  databases() {
    return Databases.find({connection_id: this._id}, {sort: {name: 1}});
  },

  defaultDatabase() {
    return Databases.findOne({connection_id: this._id, name: this.database})
  },


  mainDatabase() {
    const defaultDatabase = this.defaultDatabase();
    if(defaultDatabase) {
      return defaultDatabase;
    } else {
      return Databases.findOne({connection_id: this._id}, {sort: {name: 1}});
    }
  }
});
