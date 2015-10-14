class CollectionManager {
	constructor() {
		this.collections = {}
	}

	mountCollection(collectionId) {
    log(collectionId);
    let collection = Collections.findOne(collectionId);
    let database = Databases.findOne(collection.database_id);
    let connection = Connections.findOne(database.connection_id);
		if (!connection || !database || !collection) return false;

		if (!this.collections[collectionId]) {
			this.collections[collectionId] = new Mongo.Collection(collection.name);
			Meteor.call('mountCollection', collectionId);
		}

		return this.collections[collectionId];
	}

	mountCollectionOnServer(collectionId) {
		if (Meteor.isServer) {
      let collection = Collections.findOne(collectionId);
      let database = Databases.findOne(collection.database_id);
      let connection = Connections.findOne(database.connection_id);
			if (!connection || !database || !collection) return false;

			if (!Mongo.Collection.get(collection.name)) {
				let driver = new MongoInternals.RemoteCollectionDriver('mongodb://' + connection.host + ':' + connection.port +'/' + database.name);
				new Mongo.Collection(collection.name, {_driver: driver});
			}
		}
	}
}

cm = new CollectionManager();
