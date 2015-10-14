class CollectionManager {
	constructor() {
		this.collections = {}
	}

	mountCollection(connectionId, databaseId, collectionId) {
		let connection = Connections.findOne(connectionId);
		let database = Databases.findOne({connection_id: connectionId, _id: databaseId});
		let collection = Collections.findOne({database_id: databaseId, _id: collectionId});
		if (!connection || !database || !collection) return false;

		if (!this.collections[collectionId]) {
			this.collections[collectionId] = new Mongo.Collection(collection.name);
			Meteor.call('mountCollection', connectionId, databaseId, collectionId);
		}

		return this.collections[collectionId];
	}

	mountCollectionOnServer(connectionId, databaseId, collectionId) {
		if (Meteor.isServer) {
			let connection = Connections.findOne(connectionId);
			let database = Databases.findOne({connection_id: connectionId, _id: databaseId});
			let collection = Collections.findOne({database_id: databaseId, _id: collectionId});
			if (!connection || !database || !collection) return false;

			if (!Mongo.Collection.get(collection.name)) {
				let driver = new MongoInternals.RemoteCollectionDriver('mongodb://' + connection.host + ':' + connection.port +'/' + database.name);
				new Mongo.Collection(collection.name, {_driver: driver});
			}
		}
	}
}

cm = new CollectionManager();
