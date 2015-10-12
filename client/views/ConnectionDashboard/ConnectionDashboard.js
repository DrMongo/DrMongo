Template.ConnectionDashboard.onCreated(function () {
	breadcrumb.path([]);
	this.subscribe('connection', FlowRouter.current().params._id);
});

Template.ConnectionDashboard.helpers({
	connection() {
		return Connections.findOne(FlowRouter.current().params._id);
	},
	databases() {
		return Databases.find({}, {sort: {name: 1}});
	}
});
