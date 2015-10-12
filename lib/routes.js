var frontRoutes = FlowRouter.group({});

var adminRoutes = FlowRouter.group({
  prefix: "/admin"
});


// admin - routes
adminRoutes.route('/collections', {
  name: 'collections',
  action(params) {
    BlazeLayout.render("adminLayout", {content: 'collections'});
  }
});

adminRoutes.route('/collection/:name', {
  name: 'collectionList',
  action(params) {
    BlazeLayout.render("adminLayout", {content: 'collectionList'});
  }
});


if(Meteor.isClient) {
  breadcrumb.defaultPath([
    {text: 'Dashboard', link: pathTo('collections')}
  ]);
}
