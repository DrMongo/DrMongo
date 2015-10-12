Meteor.methods({
	mountCollection(name, connectionId) {
		check(name, String);

		cm.mountCollectionOnServer(name, connectionId);
	},
	getConnectionStructure(connectionId) {
		let connection = Connections.findOne(connectionId);
		if (!connection) return false;
		let databases = MongoHelpers.getDatabases(connection);

		Databases.update({connection_id: connectionId}, {$set: {keep: false}})
		_.each(databases, (databaseName) => {
			Databases.upsert(
				{connection_id: connectionId, name: databaseName},
				{
					$set: {
						updatedAt: new Date,
						keep: true
					}
				}
			);

			let database = Databases.findOne({connection_id: connectionId, name: databaseName});

			Collections.update({database_id: database._id}, {$set: {keep: false}});
			let collections = MongoHelpers.getCollections(connection, databaseName);
			_.each(collections, (collectionName) => {
				Collections.upsert(
					{database_id: database._id, name: collectionName},
					{
						$set: {
							updatedAt: new Date,
							keep: true
						}
					}
				);
			});
			Collections.remove({database_id: database._id, keep: false});

		});
		Databases.remove({connection_id: connectionId, keep: false});
		return true;
	}
});
