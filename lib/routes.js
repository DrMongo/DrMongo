FlowRouter.subscriptions = function () {
  this.register('connectionStructure', Meteor.subscribe('connectionStructure'));
};

FlowRouter.route('/', {
  name: 'Connections',
  action(params) {
    BlazeLayout.render("DefaultLayout", {template: 'Connections'});
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
  name: 'Documents',
  action(params) {
    BlazeLayout.render("DefaultLayout", {template: 'Documents'});
  }
});
