let parseJson = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    log('invalid json :( ', str, e);
    return false;
  }
};

Template.DocumentsFilter.onCreated(function() {
  this.invalidSelection = new ReactiveVar(null);
  this.invalidOptions = new ReactiveVar(null);
});

Template.DocumentsFilter.helpers({
  invalidSelection() {
    return Template.instance().invalidSelection.get();
  },

  invalidOptions() {
    return Template.instance().invalidOptions.get();
  }
});


Template.DocumentsFilter.events({
  'submit form.document-filter'(e, i) {
    e.preventDefault();
    const selection = e.currentTarget.selection.value;
    const options = e.currentTarget.options.value;

    let selectionJson = {};
    if(!!selection) {
      selectionJson = parseJson(selection);
      if(!selectionJson) {
        i.invalidSelection.set('Invalid json format');
        return false;
      }
    } else {
      i.invalidSelection.set(false);
    }

    let optionsJson = {};
    if(!!options) {
      optionsJson = parseJson(options);
      if(!optionsJson) {
        i.invalidOptions.set('Invalid json format');
        return false;
      }
    } else {
      i.invalidOptions.set(false);
    }

    i.data.onSubmit(selectionJson, optionsJson);
  }
});
