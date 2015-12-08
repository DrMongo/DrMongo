Template.CollectionDashboardModal.onCreated(function () {
  this.rawStats = new ReactiveVar(null);
  this.autorun(() => {
    this.rawStats.set('Loading...');
    var ModalParams = Session.get('CollectionDashboardModal');
    if(ModalParams) {
      Meteor.call('stats.rawCollectionStats', ModalParams.collectionId, (error, stats) => {
        if(error) {
          log(error);
        } else {
          this.rawStats.set(JSON.stringify(stats, null, 2));
        }
      });
    }
  });

});

Template.CollectionDashboardModal.helpers({
  connection() {
    var ModalParams = Session.get('CollectionDashboardModal');
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
  },
  rawStats() {
    return Template.instance().rawStats.get();
  }
});

Template.CollectionDashboardModal.events({
  'click #drop-all-documents': function (e, t) {
    e.preventDefault();
    var ModalParams = Session.get('CollectionDashboardModal');
    var c = Collections.findOne(ModalParams.collectionId);

    if (!confirm('Drop ALL documents in ' + c.name + '?')) return false;

    Meteor.call('dropAllDocuments', ModalParams.collectionId, function(error, result) {
      $('#CollectionDashboardModal').modal('hide');
      refreshDocuments();
    });
  }
});
