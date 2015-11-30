FlowRouter.route('/', {
  name: 'Connections',
  action(params) {
    BlazeLayout.render("DefaultLayout", {template: 'Connections'});
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
    BlazeLayout.render("DefaultLayout", {template: 'ConnectionDashboard'});
  }
});

FlowRouter.route('/:connection/:database', {
  name: 'DatabaseDashboard',
  action(params) {
    BlazeLayout.render("DefaultLayout", {template: 'DatabaseDashboard'});
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


FlowRouter.route('/:connection/:database/:collection/:filter?/:pagination?', {
  name: 'Documents',
  action(params) {
    BlazeLayout.render("DefaultLayout", {
      template: 'Documents',
      sidebar: 'Sidebar'
    });
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
