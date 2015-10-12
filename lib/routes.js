FlowRouter.route('/', {
  name: 'Connections',
  action(params) {
    BlazeLayout.render("AdminLayout", {template: 'Connections'});
  }
});

FlowRouter.route('/:connectionId', {
  name: 'DatabaseDashboard',
  action(params) {
    BlazeLayout.render("AdminLayout", {template: 'DatabaseDashboard'});
  }
});

FlowRouter.route('/:connectionId/:database/:collection', {
  name: 'TreeView',
  action(params) {
    BlazeLayout.render("AdminLayout", {template: 'TreeView'});
  }
});

if(Meteor.isClient) {
  breadcrumb.defaultPath([
    {text: 'Dashboard', link: pathTo('collections')}
  ]);
}
