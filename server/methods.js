Meteor.methods({
	mountCollection(name, connectionId) {
		check(name, String);

		cm.mountCollectionOnServer(name, connectionId);
	},
	getConnectionStructure(connectionId) {
		let connection = Connections.findOne(connectionId);
		if (!connection) return false;
		let databases = MongoHelpers.getDatabases(connection);

		Databases.update({connection: connectionId}, {$set: {keep: false}})
		_.each(databases, (databaseName) => {
			Databases.upsert(
				{connection: connectionId, name: databaseName},
				{
					$set: {
						updatedAt: new Date,
						keep: true
					}
				}
			);

			let database = Databases.findOne({connection: connectionId, name: databaseName});

			Collections.update({database: database._id}, {$set: {keep: false}});
			let collections = MongoHelpers.getCollections(connection, databaseName);
			_.each(collections, (collectionName) => {
				Collections.upsert(
					{database: database._id, name: collectionName},
					{
						$set: {
							updatedAt: new Date,
							keep: true
						}
					}
				);
			});
			Collections.remove({database: database._id, keep: false});

		});
		Databases.remove({connection: connectionId, keep: false});
		return true;
	}
});
