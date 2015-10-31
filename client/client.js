ConnectionStructureSubscription = Meteor.subscribe('connectionStructure');

MountedCollections = {};

CurrentSession = new ReactiveObjects({
  connection: null,
  database: null,
  collection: null,
  mongoCollection: null,
  mongoCollectionSubscription: null,
  documentsSelector: '{}',
  documentsOptions: {},
  documentsRandomSeed: 0,
  documentsPaginationSkip: 0,
  documentsPaginationLimit: 20
});


Meteor.startup(function() {
});

Tracker.autorun(function () {
  FlowRouter.watchPathChange();
  var currentContext = FlowRouter.current();
  var routeParams = currentContext.params;

  if (!ConnectionStructureSubscription.ready()) return false;

  CurrentSession.connection = null;
  CurrentSession.database = null;
  CurrentSession.collection = null;
  CurrentSession.documentsSelector = '{}';
  CurrentSession.documentsOptions = {};
  CurrentSession.documentPaginationSkip = 0;
  //if (CurrentSession.mongoCollectionSubscription) CurrentSession.mongoCollectionSubscription.stop();

  let Location = {};
  if (routeParams.connection) {
    CurrentSession.connection = Connections.findOne({slug: routeParams.connection});
    if (!CurrentSession.connection) FlowRouter.go('/');
    if (CurrentSession.connection && !MountedCollections[CurrentSession.connection._id]) {
      MountedCollections[CurrentSession.connection._id] = {};
    }

    if (CurrentSession.connection && routeParams.database) {
      CurrentSession.database = Databases.findOne({
        name: routeParams.database,
        connection_id: CurrentSession.connection._id
      });
      if (!CurrentSession.database) FlowRouter.go('/');

      if (isDemo() && CurrentSession.database.name.indexOf('dummy') !== 1) FlowRouter.go('/');

      if (CurrentSession.database && !MountedCollections[CurrentSession.connection._id][CurrentSession.database._id]) {
        MountedCollections[CurrentSession.connection._id][CurrentSession.database._id] = cm.mountAllCollections(CurrentSession.database);
      }

      if (CurrentSession.database && routeParams.collection) {
        CurrentSession.collection = Collections.findOne({
          name: routeParams.collection,
          database_id: CurrentSession.database._id
        });
        if (!CurrentSession.collection) FlowRouter.go('/');

        if (CurrentSession.collection) {
          CurrentSession.mongoCollection = MountedCollections[CurrentSession.connection._id][CurrentSession.database._id][CurrentSession.collection._id];
        }
      }
    }
  }
});

Tracker.autorun(function () {
  if (CurrentSession.collection) {
    seo.setTitle(CurrentSession.collection.name);
  } else if (CurrentSession.database) {
    seo.setTitle(CurrentSession.database.name);
  } else if (CurrentSession.connection) {
    seo.setTitle(CurrentSession.connection.name);
  } else {
    seo.setTitle(null);
  }
});
