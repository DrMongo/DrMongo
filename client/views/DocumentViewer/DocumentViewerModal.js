Template.DocumentViewerModal.onCreated(function () {

});

Template.DocumentViewerModal.helpers({
  connection() {
    var ModalParams = Session.get('DocumentViewerModal');
    if (!ModalParams) return false;
    return Connections.findOne(ModalParams.connectionId);
  },
  database() {
    var ModalParams = Session.get('DocumentViewerModal');
    if (!ModalParams) return false;
    return Connections.findOne(ModalParams.databaseId);
  },
  collection() {
    var ModalParams = Session.get('DocumentViewerModal');
    if (!ModalParams) return false;
    return Connections.findOne(ModalParams.collectionId);
  },
  json() {
  },
  config() {
    var ModalParams = Session.get('DocumentViewerModal');
    if (!ModalParams) return false;
    var jsonData = EJSON.stringify(ModalParams.document, {indent: '\t'});

    return function (viewer) {
      // Set some reasonable options on the viewer
      viewer.setValue(jsonData)
      viewer.setTheme('ace/theme/chrome')
      viewer.getSession().setMode('ace/mode/json')
      viewer.setShowPrintMargin(false)
      viewer.getSession().setUseWrapMode(true)
      viewer.gotoLine(1, 1)
      viewer.focus()
    }
  }
});
Template.DocumentViewerModal.events({
});
