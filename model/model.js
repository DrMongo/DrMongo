class CollectionManager {
	constructor() {
		this.collections = {}
	}

	mountCollection(collection) {
		if (!this.collections[collection._id]) {
			this.collections[collection._id] = new Mongo.Collection(collection.name);
			Meteor.call('mountCollection', collection._id);
		}

		return this.collections[collection._id];
	}

	mountCollectionOnServer(collectionId) {
		if (Meteor.isServer) {
			log(collectionId);
      let collection = Collections.findOne(collectionId);
      let database = collection.database();
      let connection = database.connection();
			if (!connection || !database || !collection) return false;

			if (!Mongo.Collection.get(collection.name)) {
				let driver = new MongoInternals.RemoteCollectionDriver('mongodb://' + connection.host + ':' + connection.port +'/' + database.name);
				new Mongo.Collection(collection.name, {_driver: driver});
			}
		}
	}
}

cm = new CollectionManager();
