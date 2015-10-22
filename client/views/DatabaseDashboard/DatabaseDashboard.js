Template.DatabaseDashboard.onCreated(function () {
  this.routeParameters = new ReactiveVar(null);
  this.autorun(() => {
    let database = FlowRouter.getParam('database');
    let parameters = validateRouteUrl();
    this.routeParameters.set(parameters);
    seo.setTitle(parameters.database.name);
  });
});


Template.DatabaseDashboard.helpers({
  currentConnection() {
    return Template.instance().routeParameters.get().connection;
  },
  database() {
    return Template.instance().routeParameters.get().database;
  },
  collections() {
    return Template.instance().routeParameters.get().database.collections();
  }
});


Template.DatabaseDashboard.events({
  'click .add-collection'(e, i) {
    e.preventDefault();
    let name = prompt("Collection name:");

    if (name != null) {
      Meteor.call('createCollection', instance.routeParameters.get().database._id, name);
    }

  }
});
