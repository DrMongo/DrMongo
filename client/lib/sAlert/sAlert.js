Meteor.startup(function () {

  sAlert.config({
    //timeout: 'none',
    onRouteClose: false,
    offset: 10,
    stack: {
      spacing: 10, // in px
      limit: 7
    }
  });

});
