Template.TreeDocument.helpers({
  keyData() {
    return typeof this._id == 'string' ? this._id : this._id._str;
  },

  valueData() {
    return this;
  }
});

Template.TreeDocument.events({
  'click .toggle-children'(event, templateInstance) {
    event.preventDefault();
    $(e.currentTarget).parent('.parent').toggleClass('collapsed');
  },
  'click .edit-document'(event, templateInstance) {
    event.preventDefault();
  },
  'click .duplicate-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    Meteor.call('duplicateDocument', getRouteParameters().collection._id, this.value._id)
  },
  'dblclick .delete-document'(event, templateInstance) {
    event.preventDefault();

    let documentId =  $(e.currentTarget).attr('data-id');
    i.collection.remove(documentId);
  }
});
