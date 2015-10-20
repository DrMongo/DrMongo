Template.DocumentInsertModal.onCreated(function () {

});

Template.DocumentInsertModal.helpers({
  connection() {
    var ModalParams = Session.get('DocumentInsertModal');
    if (!ModalParams) return false;
    return Connections.findOne(ModalParams.connectionId);
  },
  database() {
    var ModalParams = Session.get('DocumentInsertModal');
    if (!ModalParams) return false;
    return Connections.findOne(ModalParams.databaseId);
  },
  collection() {
    var ModalParams = Session.get('DocumentInsertModal');
    if (!ModalParams) return false;
    return Connections.findOne(ModalParams.collectionId);
  },
  config() {
    var jsonData = JSON.stringify({}, null, '\t');

    return function (editor) {
      // Set some reasonable options on the editor
      editor.setValue(jsonData)
      editor.setTheme('ace/theme/chrome')
      editor.getSession().setMode('ace/mode/json')
      editor.setShowPrintMargin(false)
      editor.getSession().setUseWrapMode(true)
      editor.gotoLine(1, 1)
      editor.focus()
    }
  }
});
Template.DocumentInsertModal.events({
  'click #insert': function (e, t) {
    e.preventDefault();
    var data = ace.edit("editor").getValue();
    try {
      data = JSON.parse(data);
    }

    catch(error) {
      sAlert.error('Invalid JSON format!');
      return false;
    }
    var ModalParams = Session.get('DocumentInsertModal');
    Meteor.call('insertDocument', ModalParams.collectionId, data)
    $('#DocumentInsertModal').modal('hide');
  }
});
