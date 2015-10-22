Template.Sidebar.onCreated(function () {
  this.routeParameters = new ReactiveVar(getRouteParameters());
});

Template.Sidebar.helpers({
  collections() {
    return Template.instance().routeParameters.get().database.collections();
  },
  isActive() {
    return Template.instance().routeParameters.get().collection._id == this._id ? 'active' : '';
  },
  database() {
    return Template.instance().routeParameters.get().database;
  }
});
