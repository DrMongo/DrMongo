shortcuts.register('General', ['?', '/'], ['?'], 'Show this modal', function() {
  $('#shortcuts-modal').modal('show');
});


Template.Shortcut.helpers({
  shortcuts() {
    let s = [];
    _.each(shortcuts.list, (value, key) => {
      s.push({
        namespace: key,
        items: value
      })
    });

    return s;
  }
});
