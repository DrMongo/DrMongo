Databases = new Mongo.Collection('databases');

Databases.helpers({
  connection() {
    return Connections.findOne(this.connection_id);
  }
});
