Databases = new Mongo.Collection('databases');

Databases.helpers({
  connection() {
    return Connections.findOne(this.connection_id);
  },

  collections() {
    return Collections.find({database_id: this._id}, {sort: {name: 1}});
  }

});
