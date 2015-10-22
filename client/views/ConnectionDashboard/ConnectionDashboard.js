Template.ConnectionDashboard.onCreated(function () {
  this.connection = new ReactiveVar(Connections.findOne({slug: FlowRouter.getParam('connection')}));
  seo.setTitle(this.connection.get().name);
});

Template.ConnectionDashboard.helpers({
  connection() {
    return Template.instance().connection.get();
  },
  databases() {
    let connection = Template.instance().connection.get();
    return connection.databases();
  }
});
