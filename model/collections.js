Collections = new Mongo.Collection(DRM.collectionNamePrefix + 'collections');

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
