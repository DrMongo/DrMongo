FlowRouter.route('/', {
	name: 'Connections',
	action(params) {
		BlazeLayout.render("AdminLayout", {template: 'Connections'});
	}
});

FlowRouter.route('/:_id', {
	name: 'ConnectionDashboard',
	action(params) {
		BlazeLayout.render("AdminLayout", {template: 'ConnectionDashboard'});
	}
});

FlowRouter.route('/:connection_id/:_id', {
	name: 'DatabaseDashboard',
	action(params) {
		BlazeLayout.render("AdminLayout", {template: 'DatabaseDashboard'});
	}
});

if (Meteor.isClient) {
	breadcrumb.defaultPath([
		{text: 'Dashboard', link: pathTo('collections')}
	]);
}
