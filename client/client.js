Template.registerHelper('pathFor', function (params) {
  params = params.hash || {};
  return FlowRouter.path(params.route, params.data);
});

Template.registerHelper('pathForCollection', function (params) {
  params = params.hash || {};
  const data = {
    collectionId: params.data._id,
    databaseId: params.data.database()._id,
    connectionId: params.data.database().connection()._id
  };

  return FlowRouter.path('Documents', data);
});

Template.registerHelper('printIf', function (condition, trueValue, falseValue) {
  return condition ? trueValue : falseValue;
});

