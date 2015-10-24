ConnectionStructureSubscription = Meteor.subscribe('connectionStructure', function() {
  log('subscribed')
});

MountedCollections = {};

CurrentSession = new ReactiveObjects({
  connection: null,
  database: null,
  collection: null,
  mongoCollection: null,
  mongoCollectionSubscription: null,
  documentsSelector: '{}',
  documentsOptions: {}
});


Meteor.startup(function() {

});

//Tracker.autorun(function () {
//  log('Changed connection', CurrentSession.connection);
//});
//Tracker.autorun(function () {
//  log('Changed database', CurrentSession.database);
//});
//Tracker.autorun(function () {
//  log('Changed collection', CurrentSession.collection);
//});
//Tracker.autorun(function () {
//  log('Changed mongoCollection', CurrentSession.mongoCollection);
//});
//Tracker.autorun(function () {
//  log('Changed mongoCollectionSubscription', CurrentSession.mongoCollectionSubscription);
//});

Tracker.autorun(function () {
  log('in autorun')
  FlowRouter.watchPathChange();
  var currentContext = FlowRouter.current();
  var routeParams = currentContext.params;
  log(ConnectionStructureSubscription.ready())
  if (!ConnectionStructureSubscription.ready()) return false;

  CurrentSession.connection = null;
  CurrentSession.database = null;
  CurrentSession.collection = null;
  //if (CurrentSession.mongoCollectionSubscription) CurrentSession.mongoCollectionSubscription.stop();

  let Location = {};
  if (routeParams.connection) {
    log('1')
    CurrentSession.connection = Connections.findOne({slug: routeParams.connection});
    if (CurrentSession.connection && !MountedCollections[CurrentSession.connection._id]) {
      MountedCollections[CurrentSession.connection._id] = {};
    }
    log('2')

    if (CurrentSession.connection && routeParams.database) {
      CurrentSession.database = Databases.findOne({
        name: routeParams.database,
        connection_id: CurrentSession.connection._id
      });
      log('3')

      if (CurrentSession.database && !MountedCollections[CurrentSession.connection._id][CurrentSession.database._id]) {
        MountedCollections[CurrentSession.connection._id][CurrentSession.database._id] = cm.mountAllCollections(CurrentSession.database);
      }
      log('4')

      if (CurrentSession.database && routeParams.collection) {
        CurrentSession.collection = Collections.findOne({
          name: routeParams.collection,
          database_id: CurrentSession.database._id
        });
        log('5')

        if (CurrentSession.collection) {
          log('6')
          CurrentSession.mongoCollection = MountedCollections[CurrentSession.connection._id][CurrentSession.database._id][CurrentSession.collection._id];
        }
      }
    }
  }
});
