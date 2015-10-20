Template.Tree.onCreated(function () {
});

Template.Tree.onRendered(function() {
  var clipboard = new Clipboard('.copy-value');
  clipboard.on('success', function(event) {
    sAlert.success('Copied to clipboard.');
  });
});


Template.Tree.helpers({

});
