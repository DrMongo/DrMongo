Template.Sidebar.onCreated(function () {
});

Template.Sidebar.helpers({
  collections() {
    return Collections.find({database_id: FlowRouter.getParam('databaseId')}, {sort: {name: 1}});
  }
});
