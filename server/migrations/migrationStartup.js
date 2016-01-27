Migrations.config({
  collectionName: DRM.collectionNamePrefix + 'migrations'
});

Meteor.startup(function() {
  Migrations.migrateTo('latest');
  //Migrations.migrateTo('1,rerun');
});
