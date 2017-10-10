Meteor.startup(function() {
	// updateAllConnectionsStructure();
});

// updateAllConnectionsStructure = _.throttle(function() {
//     Meteor.call('updateAllConnectionsStructure');
// }, 10000, {trailing: false});

updateConnectionStructure = _.throttle(function(connectionId, cb) {
    Meteor.call('updateConnectionStructure', connectionId, cb);
}, 10000, {trailing: false});
