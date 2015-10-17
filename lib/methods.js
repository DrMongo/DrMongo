Meteor.methods({
	duplicateDocument(collectionId, documentId) {
		let collection = Collections.findOne(collectionId);
		let database = collection.database();
		let connection = database.connection();
		if (!connection || !database || !collection) return false;


		let data = Mongo.Collection.get(collectionId).findOne(documentId);
		if (!data) return false;

		delete data._id;
		return Mongo.Collection.get(collectionId).insert(data);

	}
});
