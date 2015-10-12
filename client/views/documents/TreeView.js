Template.TreeView.onCreated(function () {
	this.items = () => {
		return Mongo.Collection.get(collection.name).find();
	}
});


Template.TreeView.helpers({
	items() {
		let collection = Collections.findOne(FlowRouter.getParam('collectionId'));
		if (collection) {
			return Mongo.Collection.get(collection.name).find();
		}
	}
});
