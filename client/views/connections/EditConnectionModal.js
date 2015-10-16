Template.EditConnectionModal.onCreated(function () {

});

Template.EditConnectionModal.helpers({
  connection() {
    var ModalParams = Session.get('EditConnectionModal');
    if (!ModalParams) return false;
    return Connections.findOne(ModalParams.connectionId);
  }
});
Template.EditConnectionModal.events({
  'submit form': function (e, t) {
    e.preventDefault();
    Connections.update(this._id, {
      $set: {
        name: t.$('#name').val() || 'New Connection',
        host: t.$('#host').val() || 'localhost',
        port: t.$('#port').val() || '27017',
        database: t.$('#database').val()
      }
    });
    $('#EditConnectionModal').modal('hide');
  }
});
