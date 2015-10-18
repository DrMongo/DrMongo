Template.Commands.onCreated(function () {
  var parameters = validateRouteUrl();
  this.routeParameters = new ReactiveVar(parameters);

  this.externalCollection = cm.mountCollection(parameters.collection);
  this.subscribe('externalCollection', parameters.collection.name);
});

Template.Commands.helpers({
  collection() {
    return Template.instance().routeParameters.get().collection;
  },

  config() {
    return function (editor) {
      // Set some reasonable options on the editor
      editor.setValue("");
      editor.setTheme('ace/theme/chrome');
      editor.getSession().setMode('ace/mode/javascript');
      editor.setShowPrintMargin(false);
      editor.getSession().setUseWrapMode(true);
      editor.gotoLine(1, 1);
      editor.focus();
    }
  }
});


Template.Commands.events({
  'submit form.commands-editor': function (event, templateInstance) {
    event.preventDefault();
    let editor = ace.edit("editor");
    let data = editor.getValue();
    let collection = templateInstance.routeParameters.get().collection;
    let externalCollection = templateInstance.externalCollection;

    editor.focus();

    eval("var " + collection.className() + " = externalCollection; " + collection.className());
    (function() {
      'use strict';
      var evalData = null;
      try {
        evalData = eval(data);
      } catch (e) {
        evalData = e;
      }
      log('>> response <<', evalData);
      $('.commands .response').html(evalData);
    }())
  }
});
