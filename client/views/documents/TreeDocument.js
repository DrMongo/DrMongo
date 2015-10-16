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
    alert('You are editing ' + i.data._id);
  },
  'click .duplicate-document'(e, i) {
    e.preventDefault();
    log(Template.parentData(5).externalCollection)
    log(i); return false;
    let data = deepClone(i.data);
    data._id = Random.id();
  }
});
