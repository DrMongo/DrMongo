Template.TreeView.onCreated(function() {
  let collectionName = FlowRouter.getParam('name');

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
