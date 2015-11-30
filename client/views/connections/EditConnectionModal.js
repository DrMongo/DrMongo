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
    const mongoUri = t.$('#mongo-uri').val();
    let uri;
    if(mongoUri) {
      uri = MongodbUriParser.parse(mongoUri);
    } else {
      uri = {};
    }
    Connections.update(this._id, {
      $set: {
        name: t.$('#name').val() || 'New Connection',
        mongoUri: mongoUri || 'mongodb://localhost:27017',
        database: uri.database || null
      }
    });
    Meteor.call('updateConnectionStructure', this._id, function (error, result) {
      console.log(error, result)
    });
    $('#EditConnectionModal').modal('hide');
  }
});
