Meteor.startup(function() {
	updateAllConnectionsStructure();
});

updateAllConnectionsStructure = _.throttle(function() {
    Meteor.call('updateAllConnectionsStructure');
}, 10000, {trailing: false});