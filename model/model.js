class CollectionManager {
  constructor() {
    this.collections = {}
  }

  mountCollection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new Mongo.Collection(name);
      Meteor.call('mountCollection', name, "default");
    }

    return this.collections[name];
  }

  mountCollectionOnServer(name, connection) {
    if (Meteor.isServer) {
      if (!Mongo.Collection.get(name)) {
        database = new MongoInternals.RemoteCollectionDriver("mongodb://127.0.0.1:27017/db1");
        new Mongo.Collection(name, {_driver: database});
      }
    }
  }
}

cm = new CollectionManager();
