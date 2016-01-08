Migrations.config({
  collectionName: dr.collectionNamePrefix + 'migrations'
});

Meteor.startup(function() {
  Migrations.migrateTo('latest');
  //Migrations.migrateTo('1,rerun');
});
