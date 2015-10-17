Template.DefaultLayout.helpers({
  ready() {
    log('> connectionStructure', FlowRouter.subsReady("connectionStructure"));
    return FlowRouter.subsReady("connectionStructure")
  }
});
