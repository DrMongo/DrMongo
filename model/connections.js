Connections = new Mongo.Collection('connections');

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
  }
});
