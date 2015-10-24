Template.Navigation.onCreated(function () {
});


Template.Navigation.onRendered(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

Template.Navigation.helpers({
  currentConnection() {
    return CurrentSession.connection;
  },
  currentDatabase() {
    return CurrentSession.database;
  },
  currentCollection() {
    return CurrentSession.collection;
  },
  connections() {
    return Connections.find({}, {sort: {name: 1}});
  },
  databases() {
    var connection = CurrentSession.connection;
    return Databases.find({connection_id: connection._id}, {sort: {name: 1}});
  },
  collections() {
    var database = CurrentSession.database;
    return Collections.find({database_id: database._id}, {sort: {name: 1}});
  }
});

Template.Navigation.events({
  'click .refresh-connection': function (event, templateInstance) {
    event.preventDefault();
    const connection = CurrentSession.connection;

    if (connection) {
      Meteor.call('updateConnectionStructure', connection._id, function (error, result) {
        console.log(error, result)
      });
    }
  },
  'submit #quick-search': function (event, templateInstance) {
    event.preventDefault();
    let searchString = $('#quick-search input').val();
    if (!resemblesId(searchString)) {
      sAlert.warning('Not an ID.');
      return false;
    }
    Meteor.call('findCollectionForDocumentId', CurrentSession.database._id, searchString, (error, result) => {
      let c = Collections.findOne({database_id: CurrentSession.database._id, name: result});
      if (c) {
        CurrentSession.documentsSelector = searchString;
        CurrentSession.documentsOptions = {};
        const data = {
          collection: c.name,
          database: c.database().name,
          connection: c.database().connection().slug
        };

        goTo(FlowRouter.path('Documents', data));
      }
    });
  }
});
