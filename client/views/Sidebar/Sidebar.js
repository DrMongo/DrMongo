Template.Sidebar.onCreated(function () {
  this.routeParameters = new ReactiveVar(getRouteParameters());
});

Template.Sidebar.helpers({
  collections() {
    return Template.instance().routeParameters.get().database.collections();
  }
});
