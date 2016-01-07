FlowRouter.route('/', {
  name: 'Connections',
  action(params) {
    ReactLayout.render(SimpleReactLayout, {content: <ConnectionsPage />});
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
    ReactLayout.render(SimpleReactLayout, {content: <ConnectionDashboardPage {...params} />});
  }
});

FlowRouter.route('/:connection/:database', {
  name: 'DatabaseDashboard',
  action(params) {
    ReactLayout.render(DefaultReactLayout, {content: <DatabaseDashboardPage {...params} />});
  }
});

FlowRouter.route('/:connection/:database/console', {
  name: 'Console',
  action(params) {
    BlazeLayout.render("DefaultLayout", {
      template: 'Console'
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


FlowRouter.route('/:connection/:database/:collection/:filter?', {
  name: 'Documents',
  action(params, queryParams) {
    params = _.extend(params, queryParams);
    ReactLayout.render(DefaultReactLayout, {content: <DocumentsPage {...params} />});

  }
});


// implemented routes
var blazeRoutes = FlowRouter.group({
  prefix: '/blaze',
  name: 'blaze'
});


blazeRoutes.route('/', {
  name: 'BlazeConnections',
  action(params) {
    BlazeLayout.render("DefaultLayout", {template: 'Connections'});
  }
});



if (Meteor.isClient) {
  redirectToMainCollection = () => {
    Tracker.afterFlush(() => {
      let connection = Connections.findOne({slug: FlowRouter.getParam('connection')});
      let databaseName = FlowRouter.getParam('database');
      let database = null;
      if(databaseName) {
        database = Databases.findOne({name: databaseName, connection_id: connection._id});
      } else {
        database = connection.mainDatabase();
      }

      if (!database || !database.mainCollection()) return false;

      goTo('Documents', {
        connection: CurrentSession.connection.slug,
        database: database.name,
        collection: database.mainCollection().name
      });
    });
  }

}
