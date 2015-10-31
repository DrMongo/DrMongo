Template.DefaultLayout.helpers({
  ready() {
    return ConnectionStructureSubscription.ready() && CurrentSession.mountedCollections;
  },
  showReloadingAlert() {
    return Session.get('showReloadingAlert');
  }
});
