Template.Connections.onCreated(function () {
	breadcrumb.path([]);

	this.subscribe('connections');
});

Template.Connections.helpers({
	connections() {
		return Connections.find({}, {sort: {name: 1}});
	}
});

Template.Connections.events({
	'click #add-connection': function (e, t) {
		e.preventDefault();
		Connections.insert({
			name: 'New Connection',
			host: 'localhost',
			port: '27017'
		})
	},
	'click #edit-connection': function (e, t) {
		e.preventDefault();
		Session.set('EditConnectionModal', {
			connectionId: this._id
		});
		$('#EditConnectionModal').modal('show');
	},
	'click #refresh-connection': function (e, t) {
		e.preventDefault();
		Meteor.call('getConnectionStructure', this._id, function(e,r) {
			console.log(e, r)
		})
	},
	'click #remove-connection': function (e, t) {
		e.preventDefault();
		Connections.remove(this._id)
	}
});
