Databases = new Mongo.Collection(DRM.collectionNamePrefix + 'databases');

Databases.helpers({
  getTheme() {
    return this.theme ? this.theme : 'default';
  },

  connection() {
    return Connections.findOne(this.connection_id);
  },

  collections() {
    return Collections.find({database_id: this._id}, {sort: {name: 1}}).fetch();
  },

  mainCollection() {
    return Collections.findOne({database_id: this._id}, {sort: {name: 1}});
  }
});
