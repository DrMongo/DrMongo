Meteor.startup(function() {
	updateAllConnectionsStructure();
});

updateAllConnectionsStructure = _.throttle(function() {
    Meteor.call('updateAllConnectionsStructure');
}, 10000, {trailing: false});

updateConnectionStructure = _.throttle(function(connectionId) {
    Meteor.call('updateConnectionStructure', connectionId);
}, 10000, {trailing: false});
