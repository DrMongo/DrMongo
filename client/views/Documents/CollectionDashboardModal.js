Template.CollectionDashboardModal.onCreated(function () {

});

Template.CollectionDashboardModal.helpers({
  connection() {
    var ModalParams = Session.get('CollectionDashboardModal');
    log(ModalParams)
    if (!ModalParams) return false;
    return Connections.findOne(ModalParams.connectionId);
  },
  database() {
    var ModalParams = Session.get('CollectionDashboardModal');
    if (!ModalParams) return false;
    return Connections.findOne(ModalParams.databaseId);
  },
  collection() {
    var ModalParams = Session.get('CollectionDashboardModal');
    if (!ModalParams) return false;
    return Collections.findOne(ModalParams.collectionId);
  }
});

Template.CollectionDashboardModal.events({
  'click #drop-all-documents': function (e, t) {
    e.preventDefault();
    var ModalParams = Session.get('CollectionDashboardModal');
    var c = Collections.findOne(ModalParams.collectionId);

    if (!confirm('Drop ALL documents in ' + c.name + '?')) return false;

    Meteor.call('dropAllDocuments', ModalParams.collectionId, function(error, result) {
      log(result)
      $('#CollectionDashboardModal').modal('hide');
      refreshDocuments();      
    });
  }
});
