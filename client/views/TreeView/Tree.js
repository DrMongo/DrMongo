Template.Tree.onCreated(function () {
});

var clipboard = null;

Template.Tree.onRendered(function () {
  clipboard = new Clipboard('.copy-value');
  clipboard.on('success', function (event) {
    sAlert.success('Copied to clipboard.');
  });
});

Template.Tree.onDestroyed(function () {
  clipboard.destroy();
});


Template.Tree.helpers({});
