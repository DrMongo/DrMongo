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
});
