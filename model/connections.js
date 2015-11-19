Connections = new Mongo.Collection(dr.collectionNamePrefix + 'connections');


Connections.clearAllRelations = (doc) => {
  Databases.find({connection_id: doc._id}).forEach(function(database) {
    Collections.find({database_id: database._id}).forEach((collection) => {
      Collections.remove(collection._id);
    });
    Databases.remove(database._id);
  });
};

Connections.after.remove(function(userId, doc) {
  Connections.clearAllRelations(doc);
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
