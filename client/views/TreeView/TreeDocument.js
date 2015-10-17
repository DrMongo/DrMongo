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
    $(event.currentTarget).parent('.parent').toggleClass('collapsed');
  },
  'click .edit-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();

    Session.set('DocumentEditorModal', {
      connectionId: getRouteParameters().connection._id,
      databaseId: getRouteParameters().database._id,
      collectionId: getRouteParameters().collection._id,
      documentId: this.value._id,
      document: this.value
    });
    $('#DocumentEditorModal').modal('show');
  },
  'click .duplicate-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    Meteor.call('duplicateDocument', getRouteParameters().collection._id, this.value._id)
  },
  'click .delete-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
  },
  'dblclick .delete-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();

    Meteor.call('removeDocument', getRouteParameters().collection._id, this.value._id)
  }
});
