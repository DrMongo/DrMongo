Package.describe({
  name: "drmongo:breadcrumb",
  summary: "drmongo breadcrumb",
  version: "0.1.0"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'ecmascript',
    'blaze-html-templates',
    'reactive-var'
  ], 'client');

  api.addFiles([
    'Breadcrumb.js',
    'client/breadcrumb.html',
    'client/breadcrumb.js'
  ], ['client']);

  api.export('breadcrumb');
});
