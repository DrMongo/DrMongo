Template.registerHelper('log', function (parameters) {
  log(parameters);
});

Template.registerHelper('pathFor', function (params) {
  params = params.hash || {};
  return FlowRouter.path(params.route, params.data);
});

Template.registerHelper('printIf', function (condition, trueValue, falseValue) {
  return condition ? trueValue : falseValue;
});

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

Template.registerHelper('showLoader', function () {
  return Session.get('showLoader');
});
