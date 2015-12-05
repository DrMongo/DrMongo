Template.Console.onCreated(function () {
  this.commandsResults = new ReactiveVar([]);
});

Template.Console.helpers({
  currentDatabase() {
    return CurrentSession.database;
  },

  config() {
    return function (editor) {
      // Set some reasonable options on the editor
      //editor.setValue("db.collection('Blog').updateMany({live: true}, {$set:{b:0}}, {multi: true})");
      editor.setValue("");
      editor.setTheme('ace/theme/chrome');
      editor.getSession().setMode('ace/mode/javascript');
      editor.setShowPrintMargin(false);
      editor.getSession().setUseWrapMode(true);
      editor.gotoLine(1, 1);
      editor.focus();
    }
  },

  commandsResults() {
    return Template.instance().commandsResults.get();
  }
});


Template.Console.events({
  'submit form.commands-editor': function (event, templateInstance) {
    event.preventDefault();
    let editor = ace.edit("editor");
    let data = editor.getValue();
    const commandsResults = templateInstance.commandsResults;
    commandsResults.set([]); // clear commands results

    //let collection = templateInstance.routeParameters.get().collection;
    //let externalCollection = templateInstance.externalCollection;

    editor.focus();

    const commands = data
      .split(';')
      .map(v => v.trim())
      .filter(v => !!v);

    _.each(commands, (command) => {
      let results = commandsResults.get();
      var arrayLength = results.push({
        command: command,
        result: new Handlebars.SafeString('<i class="gray fa fa-circle-o-notch fa-spin"></i>')
      });
      commandsResults.set(results);

      Meteor.call('console.execute', CurrentSession.database._id, command, (error, result) => {
        let results = commandsResults.get();
        results[arrayLength - 1].result = error ? error : result;
        if(error) log(error);
        commandsResults.set(results);
      });
    });
  }
});
