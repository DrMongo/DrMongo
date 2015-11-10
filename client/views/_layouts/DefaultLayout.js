Template.DefaultLayout.helpers({
  ready() {
    return ConnectionStructureSubscription.ready() && CurrentSession.mountedCollections;
  }
});
