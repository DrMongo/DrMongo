Template.DatabaseDashboard.onCreated(function () {
  if (CurrentSession.database) seo.setTitle(CurrentSession.database.name);
});


Template.DatabaseDashboard.helpers({
  currentConnection() {
    return CurrentSession.connection;
  },
  database() {
    return CurrentSession.database;
  },
  collections() {
    return CurrentSession.database.collections();
  }
});


Template.DatabaseDashboard.events({
  'click .add-collection'(e, i) {
    e.preventDefault();
    let name = prompt("Collection name:");

    if (name != null) {
      Meteor.call('createCollection', CurrentSession.database._id, name);
    }

  }
});
