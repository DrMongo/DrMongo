class CollectionManager {
	constructor() {
		this.collections = {}
	}

	mountCollection(connectionId) {
		let connection = Connections.findOne(connectionId);
		let database = Databases.findOne({_id: connection.database_id});
		let collection = Collections.findOne({_id: database.connection_id});
		if (!connection || !database || !collection) return false;

		if (!this.collections[collectionId]) {
			this.collections[collectionId] = new Mongo.Collection(collection.name);
			Meteor.call('mountCollection', connectionId);
		}

		return this.collections[collectionId];
	}

	mountCollectionOnServer(connectionId) {
		if (Meteor.isServer) {
      let connection = Connections.findOne(connectionId);
      let database = Databases.findOne({_id: connection.database_id});
      let collection = Collections.findOne({_id: database.connection_id});
			if (!connection || !database || !collection) return false;

			if (!Mongo.Collection.get(collection.name)) {
				let driver = new MongoInternals.RemoteCollectionDriver('mongodb://' + connection.host + ':' + connection.port +'/' + database.name);
				new Mongo.Collection(collection.name, {_driver: driver});
			}
		}
	}
}

cm = new CollectionManager();
