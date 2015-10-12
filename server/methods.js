Meteor.methods({
  mountCollection(name, connectionId) {
    check(name, String);

    cm.mountCollectionOnServer(name, connectionId);
  }
});
