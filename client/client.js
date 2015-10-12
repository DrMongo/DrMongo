Template.registerHelper('pathFor', function(params) {
  params = params.hash || {};
  return FlowRouter.path(params.route, params.data);
});

