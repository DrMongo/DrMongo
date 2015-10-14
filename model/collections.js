Collections = new Mongo.Collection('collections');


Collections.helpers({
  icon() {
    return Icons.forCollection(this.name);
  }
});
