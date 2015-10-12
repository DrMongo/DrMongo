FlowRouter.subscriptions = function() {
	this.register('connectionStructure', Meteor.subscribe('connectionStructure'));
};

FlowRouter.route('/', {
	name: 'Connections',
	action(params) {
		BlazeLayout.render("HomeLayout", {template: 'Connections'});
	}
});

FlowRouter.route('/:connectionId', {
	name: 'ConnectionDashboard',
	action(params) {
		BlazeLayout.render("DefaultLayout", {template: 'ConnectionDashboard'});
	}
});

FlowRouter.route('/:connectionId/:databaseId', {
	name: 'DatabaseDashboard',
	action(params) {
		BlazeLayout.render("DefaultLayout", {template: 'DatabaseDashboard'});
	}
});

FlowRouter.route('/:connectionId/:databaseId/:collectionId', {
  name: 'TreeView',
	subscriptions(params) {
		let collection = Collections.findOne(params.collectionId);
		console.log(collection)
		cm.mountCollection(collection.name);

		this.register('connectionStructure', Meteor.subscribe(params.collectionId));
	},
  action(params) {
    BlazeLayout.render("DefaultLayout", {template: 'TreeView'});
  }
});

if(Meteor.isClient) {
  breadcrumb.defaultPath([
    {text: 'Dashboard', link: pathTo('collections')}
  ]);
}
