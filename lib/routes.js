FlowRouter.route('/', {
  name: 'Connections',
  action(params) {
    BlazeLayout.render("HomeLayout", {template: 'Connections'});
  }
});

FlowRouter.route('/theme', {
  name: 'Theme',
  action(params) {
    BlazeLayout.render("DefaultLayout", {
      template: 'Theme'
    });
  }
});

FlowRouter.route('/:connection', {
  name: 'ConnectionDashboard',
  action(params) {
    BlazeLayout.render("HomeLayout", {template: 'ConnectionDashboard'});
  }
});

FlowRouter.route('/:connection/:database', {
  name: 'DatabaseDashboard',
  action(params) {
    BlazeLayout.render("HomeLayout", {template: 'DatabaseDashboard'});
  }
});

FlowRouter.route('/:connection/:database/commands', {
  name: 'Commands',
  action(params) {
    BlazeLayout.render("DefaultLayout", {
      template: 'Commands',
      sidebar: 'Sidebar'
    });
  }
});

FlowRouter.route('/:connection/:database/js-code', {
  name: 'JsCode',
  action(params) {
    BlazeLayout.render("DefaultLayout", {
      template: 'JsCode',
      sidebar: 'Sidebar'
    });
  }
});


FlowRouter.route('/:connection/:database/:collection', {
  name: 'Documents',
  action(params) {
    BlazeLayout.render("DefaultLayout", {
      template: 'Documents',
      sidebar: 'Sidebar'
    });
  }
});

if (Meteor.isClient) {

  //validateRouteUrl = () => {
  //  const parameters = getRouteParameters();
  //  const url = [
  //    parameters.connection ? parameters.connection.slug : '',
  //    parameters.database ? parameters.database.name : '',
  //    parameters.collection ? parameters.collection.name : ''
  //  ]
  //    .filter((v) => {
  //      return !!v
  //    })
  //    .join('/');
  //
  //  const expectedUrl = [
  //    FlowRouter.getParam('connection'),
  //    FlowRouter.getParam('database'),
  //    FlowRouter.getParam('collection')
  //  ]
  //    .filter((v) => {
  //      return !!v
  //    })
  //    .join('/');
  //
  //
  //  if (url != expectedUrl) {
  //    goTo('Connections');
  //    return false;
  //  }
  //
  //  return parameters;
  //};
}
