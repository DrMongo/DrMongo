Template.TreeDocument.helpers({
  keyData() {
    return this._id;
  },

  valueData() {
    return this;
  }
});


Template.TreeDocument.events({
  'click .toggle-children'(e, i) {
    e.preventDefault();
    $(e.currentTarget).parent('.parent').toggleClass('collapsed');
  }
});
