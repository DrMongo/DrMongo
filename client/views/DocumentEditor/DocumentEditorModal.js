Template.DocumentEditorModal.onCreated(function () {

});

Template.DocumentEditorModal.helpers({
  connection() {
    var ModalParams = Session.get('DocumentEditorModal');
    if (!ModalParams) return false;
    return Connections.findOne(ModalParams.connectionId);
  },
  database() {
    var ModalParams = Session.get('DocumentEditorModal');
    if (!ModalParams) return false;
    return Connections.findOne(ModalParams.databaseId);
  },
  collection() {
    var ModalParams = Session.get('DocumentEditorModal');
    if (!ModalParams) return false;
    return Connections.findOne(ModalParams.collectionId);
  },
  json() {
  },
  config() {
    var ModalParams = Session.get('DocumentEditorModal');
    if (!ModalParams) return false;
    var jsonData = JSON.stringify(ModalParams.document, null, '\t');

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
Template.DocumentEditorModal.events({
  'click #save-changes': function (e, t) {
    e.preventDefault();
    var data = ace.edit("editor").getValue();
    try {
      data = JSON.parse(data);
    }

    catch (error) {
      sAlert.error('Invalid JSON format!');
      return false;
    }
    var ModalParams = Session.get('DocumentEditorModal');
    Meteor.call('updateDocument', ModalParams.collectionId, ModalParams.documentId, data)
    $('#DocumentEditorModal').modal('hide');
  }
});
