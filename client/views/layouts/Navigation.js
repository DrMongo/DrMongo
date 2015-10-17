Template.Navigation.onCreated(function () {
  this.routeParameters = new ReactiveVar(getRouteParameters());
});

Template.Navigation.helpers({
  currentConnection() {
    return Template.instance().routeParameters.get().connection;
  },
  currentDatabase() {
    return Template.instance().routeParameters.get().database;
  },
  connections() {
    return Connections.find({}, {sort: {name: 1}});
  },
  databases() {
    return Databases.find({}, {sort: {name: 1}});
  }
});

Template.Navigation.events({
  'click #add-connection': function (event, templateInstance) {
    event.preventDefault();
    Connections.insert({
      name: 'New Connection',
      host: 'localhost',
      port: '27017'
    })
  }
});
