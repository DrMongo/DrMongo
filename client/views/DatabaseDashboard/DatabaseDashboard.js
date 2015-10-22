Template.DatabaseDashboard.onCreated(function () {
  this.routeParameters = new ReactiveVar(validateRouteUrl());
  seo.setTitle(this.routeParameters.get().database.name);
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
