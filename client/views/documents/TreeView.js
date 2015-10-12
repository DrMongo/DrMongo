Template.TreeView.onCreated(function() {
  let collectionName = FlowRouter.getParam('collection');

  breadcrumb.path([
    {text: collectionName}
  ]);

  cm.mountCollection(collectionName);
  this.subscribe('collection', collectionName);
  this.items = () => {
    return Mongo.Collection.get(collectionName).find();
  }
});


Template.TreeView.helpers({
  items() {
    return Template.instance().items();
  }
});
