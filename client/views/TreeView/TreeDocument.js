Template.TreeDocument.helpers({
  keyData() {
    return typeof this._id == 'string' ? this._id : this._id._str;
  },

  valueData() {
    return this;
  }
});


Template.TreeDocument.events({
  'click .toggle-children'(e, i) {
    e.preventDefault();
    $(e.currentTarget).parent('.parent').toggleClass('collapsed');
  },
  'click .edit-document'(e, i) {
    e.preventDefault();
  },
  'click .duplicate-document'(e, i) {
    e.preventDefault();
    log(this); return false;
    Meteor.call('duplicateDocument', FlowRouter.getParam(collectionId, this._id))
  },
  'dblclick .delete-document'(e, i) {
    e.preventDefault();

    let documentId =  $(e.currentTarget).attr('data-id');
    i.collection.remove(documentId);
  }
});
