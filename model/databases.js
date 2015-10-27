Databases = new Mongo.Collection(dr.collectionNamePrefix + 'databases');

Databases.helpers({
  connection() {
    return Connections.findOne(this.connection_id);
  },

  collections() {
    return Collections.find({database_id: this._id}, {sort: {name: 1}});
  },

  mainCollection() {
    return Collections.findOne({database_id: this._id}, {sort: {name: 1}});
  }

});
