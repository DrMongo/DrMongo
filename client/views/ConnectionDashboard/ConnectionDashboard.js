Template.ConnectionDashboard.onCreated(function () {
});

Template.ConnectionDashboard.helpers({
	connection() {
		return Connections.findOne(FlowRouter.getParam('connectionId'));
	},
	databases() {
		return Databases.find({connection_id: FlowRouter.getParam('connectionId')}, {sort: {name: 1}});
	}
});
