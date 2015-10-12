Template.collections.onCreated(function() {
  breadcrumb.path([]);

  this.subscribe('collectionNames');
});

Template.collections.helpers({
  collections() {
    return CollectionNames.find({}, {sort: {name: 1}});
  },

  collectionIcon() {
    return Icons.forCollection(this.name)
  }
});
