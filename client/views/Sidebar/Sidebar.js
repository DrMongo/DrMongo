Template.Sidebar.onCreated(function () {
});

Template.Sidebar.helpers({
  currentConnection() {
    return Connections.findOne(FlowRouter.getParam('connectionId'));
  },
  database() {
    return Databases.findOne(FlowRouter.getParam('databaseId'));
  },
  collections() {
    return Collections.find({database_id: FlowRouter.getParam('databaseId')}, {sort: {name: 1}});
  }
});
