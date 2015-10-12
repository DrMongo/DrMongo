FlowRouter.route('/', {
  name: 'Connections',
  action(params) {
    BlazeLayout.render("AdminLayout", {template: 'Connections'});
  }
});

FlowRouter.route('/:connectionId', {
  name: 'Dashboard',
  action(params) {
    BlazeLayout.render("AdminLayout", {template: 'Dashboard'});
  }
});

if(Meteor.isClient) {
  breadcrumb.defaultPath([
    {text: 'Dashboard', link: pathTo('collections')}
  ]);
}
