ConnectionStructureSubscription = Meteor.subscribe('connectionStructure');

CurrentSession = new ReactiveObjects({
  connection: null,
  database: null,
  collection: null,
  documents: null,
  documentsReady: false,
  documentsCount: null,
  documentsFilter: '{}',
  documentsRandomSeed: 0,
  documentsPagination: 0,
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
  CurrentSession.documentsFilter = '{}';
  CurrentSession.documentsPagination = 0;
  CurrentSession.documentsPaginationLimit = 20;

  let Location = {};
  if (routeParams && routeParams.connection) {
    CurrentSession.connection = Connections.findOne({slug: routeParams.connection});
    if (!CurrentSession.connection) {
      FlowRouter.go('/');
      return false;
    }

    CurrentSession.database = null;
    CurrentSession.collection = null;
    
    if (CurrentSession.connection && routeParams.database) {
      CurrentSession.database = Databases.findOne({
        name: routeParams.database,
        connection_id: CurrentSession.connection._id
      });
      if (!CurrentSession.database) {
        FlowRouter.go('/');
        return false;
      }

      if (CurrentSession.database && routeParams.collection) {
        CurrentSession.collection = Collections.findOne({
          name: routeParams.collection,
          database_id: CurrentSession.database._id
        });
        if (CurrentSession.collection) {
          if (CurrentSession.collection.paginationLimit) CurrentSession.documentsPaginationLimit = CurrentSession.collection.paginationLimit;
        } else {
          FlowRouter.go('/');
          return false;
        }

        if (CurrentSession.collection) {
          if (routeParams.filter && routeParams.filter != '-') {
            let filter = FilterHistory.findOne(routeParams.filter);

            if (filter) {
              CurrentSession.documentsFilter = filter.filter;
            }
          }
          if (routeParams.pagination) {
            CurrentSession.documentsPagination = parseInt(routeParams.pagination) || 0;
          }
        }
      }
    }
  }  
});

Tracker.autorun(function () {
  if (CurrentSession.collection) {
    seo.setTitle(
      CurrentSession.collection.name
      + '.find('
      + CurrentSession.documentsFilter
      + '); [page '
      + (CurrentSession.documentsPagination + 1)
      + ']'
    );
  } else if (CurrentSession.database) {
    seo.setTitle(CurrentSession.database.name);
  } else if (CurrentSession.connection) {
    seo.setTitle(CurrentSession.connection.name);
  } else {
    seo.setTitle(null);
  }
});