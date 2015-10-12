Package.describe({
  name: "drmongo:mongo-helpers",
  summary: "helpers",
  version: "0.1.0"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'ecmascript',
    'mongo'
  ]);

  api.addFiles([
    'server/MongoHelpers.js'
  ], ['server']);

  api.export('MongoHelpers');
});
