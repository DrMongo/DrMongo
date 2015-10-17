Template.Commands.onCreated(function () {
  var parameters = validateRouteUrl();
  this.routeParameters = new ReactiveVar(parameters);
});
