Template.Tree.onCreated(function () {
  log('> tree created...');
});

Template.Tree.onRendered(function() {
  log('> tree rendered...');
  var clipboard = new Clipboard('.copy-value');
  clipboard.on('success', function(event) {
    sAlert.success('Copied to clipboard.');
  });
});


Template.Tree.helpers({

});
