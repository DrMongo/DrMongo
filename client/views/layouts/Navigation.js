Template.Navigation.onCreated(function () {
  this.routeParameters = new ReactiveVar(null);
  this.autorun(() => {
    const connectionSlug = FlowRouter.getParam('connection') || null;
    const databaseName = FlowRouter.getParam('database') || null;
    const collectionName = FlowRouter.getParam('collection') || null;
    this.routeParameters.set(getRouteParameters());
  });
});

Template.Navigation.helpers({
  currentConnection() {
    return Template.instance().routeParameters.get().connection;
  },
  currentDatabase() {
    return Template.instance().routeParameters.get().database;
  },
  currentCollection() {
    return Template.instance().routeParameters.get().collection;
  },
  connections() {
    return Connections.find({}, {sort: {name: 1}});
  },
  databases() {
    var connection = Template.instance().routeParameters.get().connection;
    return Databases.find({connection_id: connection._id}, {sort: {name: 1}});
  },
  collections() {
    var database = Template.instance().routeParameters.get().database;
    return Collections.find({database_id: database._id}, {sort: {name: 1}});
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
