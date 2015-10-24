Template.Navigation.onCreated(function () {
});


Template.Navigation.onRendered(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

Template.Navigation.helpers({
  currentConnection() {
    return CurrentSession.connection;
  },
  currentDatabase() {
    return CurrentSession.database;
  },
  currentCollection() {
    return CurrentSession.collection;
  },
  connections() {
    return Connections.find({}, {sort: {name: 1}});
  },
  databases() {
    var connection = CurrentSession.connection;
    return Databases.find({connection_id: connection._id}, {sort: {name: 1}});
  },
  collections() {
    var database = CurrentSession.database;
    return Collections.find({database_id: database._id}, {sort: {name: 1}});
  }
});

Template.Navigation.events({
  'click .refresh-connection': function (event, templateInstance) {
    event.preventDefault();
    const connection = CurrentSession.connection;

    if (connection) {
      Meteor.call('updateConnectionStructure', connection._id, function (error, result) {
        console.log(error, result)
      });
    }
  }
});
