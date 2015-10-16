Template.Connections.onCreated(function () {
});

Template.Connections.helpers({
  connections() {
    return Connections.find({}, {sort: {name: 1}});
  },
  connectLink() {
    let database = null;
    if (this.database) {
      database = Databases.findOne({
        connection_id: this._id,
        name: this.database
      })
    }
    if (database) {
      return '/' + this._id + '/' + database._id;
    } else {
      return '/' + this._id;
    }
  }
});

Template.Connections.events({
  'click #add-connection': function (e, t) {
    e.preventDefault();
    var newId = Connections.insert({
      name: 'New Connection',
      host: 'localhost',
      port: '27017'
    })
    Session.set('EditConnectionModal', {
      connectionId: newId
    });
    $('#EditConnectionModal').modal('show');
  },
  'click #edit-connection': function (e, t) {
    e.preventDefault();
    Session.set('EditConnectionModal', {
      connectionId: this._id
    });
    $('#EditConnectionModal').modal('show');
  },
  'click #refresh-connection': function (e, t) {
    e.preventDefault();
    Meteor.call('updateConnectionStructure', this._id, function (e, r) {
      console.log(e, r)
    })
  },
  'click #remove-connection': function (e, t) {
    e.preventDefault();
    Connections.remove(this._id)
  }
});
