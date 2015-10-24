Template.ConnectionDashboard.onCreated(function () {
});

Template.ConnectionDashboard.helpers({
  connection() {
    return CurrentSession.connection;
  },
  databases() {
    return CurrentSession.connection.databases();
  }
});
