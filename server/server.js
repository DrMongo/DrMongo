MongoClient = Meteor.npmRequire('mongodb').MongoClient;
wrappedConnect = Meteor.wrapAsync(MongoClient.connect);
