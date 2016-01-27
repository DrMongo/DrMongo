RouterUtils = {};

RouterUtils.go = (url, parameters) => {
  FlowRouter.go(url, parameters);
};

RouterUtils.setParams = (params) => {
  FlowRouter.setParams(params);
};

RouterUtils.setQueryParams = (params) => {
  FlowRouter.setQueryParams(params);
};

RouterUtils.redirect = (path) => {
  FlowRouter.redirect(path);
};

RouterUtils.path = function (name, parameters) {
  return FlowRouter.path(name, parameters);
};


RouterUtils.currentUrl = function () {
  var currentRoute = FlowRouter.current();
  var routeName = currentRoute.route.name;
  // FlowRouter.path() returns a path starting with a '/' but Meteor.absoluteUrl()
  // doesn't want it - that's why we've got the substr(1)
  return Meteor.absoluteUrl(FlowRouter.path(routeName, currentRoute.params).substr(1));
};

RouterUtils.absoluteUrl = (route, parameters) => {
  if (Meteor.isServer) {
    path = RouterUtils.path(route, parameters);
    if (path.substring(0, 1) == '/') {
      path = path.substring(1);
    }
    return Meteor.absoluteUrl(path);
  } else {
    log('> absoluteUrl() not working on client');
    return '';
  }
};


// route helpers

RouterUtils.pathForMainDatabase = function (connection) {
  const db = connection.mainDatabase();
  if(db) {
    return RouterUtils.pathForDatabaseDashboard(db);
  } else {
    return RouterUtils.pathForConnectionDashboard(connection);
  }
};

RouterUtils.pathForDefaultDatabase = function (connection) {
  const db = connection.defaultDatabase();
  if(db) {
    return RouterUtils.pathForDatabaseDashboard(db);
  } else {
    return RouterUtils.pathForConnectionDashboard(connection);
  }
};

RouterUtils.pathForConnectionDashboard = function (connection) {
  const data = {
    connection: connection.slug
  };

  return FlowRouter.path('ConnectionDashboard', data);
};

RouterUtils.pathForDatabaseDashboard = function (database) {
  const data = {
    database: database.name,
    connection: database.connection().slug
  };

  return FlowRouter.path('DatabaseDashboard', data);
};

RouterUtils.pathForConsole = function (database) {
  const data = {
    database: database.name,
    connection: database.connection().slug
  };

  return FlowRouter.path('Console', data);
};

RouterUtils.pathForJsCode = function (database) {
  const data = {
    database: database.name,
    connection: database.connection().slug
  };

  return FlowRouter.path('JsCode', data);
};

RouterUtils.pathForDocuments = function (collection, filter, page) {
  const data = {
    collection: collection.name,
    database: collection.database().name,
    connection: collection.database().connection().slug,
    filter: filter,
    page: page
  };

  return FlowRouter.path('Documents', data);
};
