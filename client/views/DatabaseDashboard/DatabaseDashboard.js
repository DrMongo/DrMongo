Template.DatabaseDashboard.onCreated(function () {
  //redirectToMainCollection();
});


Template.DatabaseDashboard.helpers({
  currentDatabase() {
    return CurrentSession.database;
  },
  collections() {
    return CurrentSession.database ? CurrentSession.database.collections() : [];
  },
  themes() {
    return [
      'dark-blue',
      'dark-teal',
      'blue',
      'light-blue',
      'green',
      'brown',
      'orange',
      'red',
      'purple'
    ]
  }
});

Template.DatabaseDashboard.events({
  'click .database-colors a': function (event, templateInstance) {
    event.preventDefault();
    let theme = $(event.currentTarget).attr('data-theme');
    log(theme);

    Databases.update(CurrentSession.database._id, {$set: {theme: theme}});
  },
  'click div.collection-settings': function (event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    log({
      collectionId: this._id,
      databaseId: this.database()._id,
      connectionId: this.database().connection()._id
    })
    Session.set('CollectionDashboardModal', {
      collectionId: this._id,
      databaseId: this.database()._id,
      connectionId: this.database().connection()._id
    });
    $('#CollectionDashboardModal').modal('show');
  }
});
