FlowRouter.subscriptions = function () {
  this.register('connectionStructure', Meteor.subscribe('connectionStructure'));
};

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

  getRouteParameters = () => {
    const connectionSlug = FlowRouter.getParam('connection') || null;
    const databaseName = FlowRouter.getParam('database') || null;
    const collectionName = FlowRouter.getParam('collection') || null;

    let parameters = {};
    if (connectionSlug) {
      parameters.connection = Connections.findOne({slug: connectionSlug});

      if (parameters.connection && databaseName) {
        parameters.database = Databases.findOne({
          name: databaseName,
          connection_id: parameters.connection._id
        });

        if (parameters.database && collectionName) {
          parameters.collection = Collections.findOne({
            name: collectionName,
            database_id: parameters.database._id
          });
        }
      }
    }

    return parameters;
  };

  validateRouteUrl = () => {
    const parameters = getRouteParameters();
    const url = [
      parameters.connection ? parameters.connection.slug : '',
      parameters.database ? parameters.database.name : '',
      parameters.collection ? parameters.collection.name : ''
    ]
      .filter((v) => {
        return !!v
      })
      .join('/');

    const expectedUrl = [
      FlowRouter.getParam('connection'),
      FlowRouter.getParam('database'),
      FlowRouter.getParam('collection')
    ]
      .filter((v) => {
        return !!v
      })
      .join('/');


    if (url != expectedUrl) {
      goTo('Connections');
      return false;
    }

    return parameters;
  };

  Template.registerHelper('pathForConnectionDashboard', function (params) {
    params = params.hash || {};
    const data = {
      connection: params.data.slug
    };

    return FlowRouter.path('ConnectionDashboard', data);
  });

  Template.registerHelper('pathForDatabaseDashboard', function (params) {
    params = params.hash || {};
    const data = {
      database: params.data.name,
      connection: params.data.connection().slug
    };

    return FlowRouter.path('DatabaseDashboard', data);
  });

  Template.registerHelper('pathForDocuments', function (params) {
    params = params.hash || {};
    const data = {
      collection: params.data.name,
      database: params.data.database().name,
      connection: params.data.database().connection().slug
    };

    return FlowRouter.path('Documents', data);
  });

  Template.registerHelper('pathForCommands', function (params) {
    params = params.hash || {};
    const data = {
      database: params.data.name,
      connection: params.data.connection().slug
    };

    return FlowRouter.path('Commands', data);
  });

  Template.registerHelper('pathForJsCode', function (params) {
    params = params.hash || {};
    const data = {
      database: params.data.name,
      connection: params.data.connection().slug
    };

    return FlowRouter.path('JsCode', data);
  });
}
