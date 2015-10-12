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
	'click #submit-button': function (e, t) {
		e.preventDefault();
		console.log('tu som')
		Connections.update(this._id, {$set: {
			name: t.$('[name=name]').val() || 'New Connection',
			host: t.$('[name=host]').val() || 'localhost',
			port: t.$('[name=port]').val() || '27017'
		}});
		$('#EditConnectionModal').modal('hide');
	}
});
