Template.EditConnectionModal.onCreated(function() {

});

Template.EditConnectionModal.helpers({
	connection() {
		var ModalParams = Session.get('EditConnectionModal');
		if (!ModalParams) return false;
		return Connections.findOne(ModalParams.connectionId);
	}
});
Template.EditConnectionModalContent.events({
	'submit form': function (e, t) {
		e.preventDefault();
		Connections.update(this._id, {$set: {
			name: t.$('[name=name]').val() || 'New Connection',
			host: t.$('[name=host]').val() || 'localhost',
			port: t.$('[name=port]').val() || '27017',
			database: t.$('[name=database]').val()
		}});
		$('#EditConnectionModal').modal('hide');
	}
});
