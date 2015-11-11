Template.DatabaseDashboard.onCreated(function () {
  //redirectToMainCollection();
});


Template.DatabaseDashboard.helpers({
  currentDatabase() {
    return CurrentSession.database;
  },
  collections() {
    return CurrentSession.database.collections()
  },
  themes() {
    return [
      'default',
      'dark-blue',
      'blue',
      'light-blue',
      'green',
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
  }
});
