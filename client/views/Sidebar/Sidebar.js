Template.Sidebar.onCreated(function () {
  this.routeParameters = new ReactiveVar(null);
  this.autorun(() => {
    const connectionSlug = FlowRouter.getParam('connection') || null;
    const databaseName = FlowRouter.getParam('database') || null;
    const collectionName = FlowRouter.getParam('collection') || null;
    this.routeParameters.set(getRouteParameters());
  });
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
