Package.describe({
  name: "drmongo:icons",
  summary: "drmongo icons",
  version: "0.1.0"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'ecmascript'
  ]);

  api.addFiles([
    'faIconsList.js',
    'Icons.js'
  ], ['client', 'server']);

  api.export('Icons');
});
