Template.registerHelper('pathFor', function (params) {
  params = params.hash || {};
  return FlowRouter.path(params.route, params.data);
});

Template.registerHelper('printIf', function (condition, trueValue, falseValue) {
  return condition ? trueValue : falseValue;
});

