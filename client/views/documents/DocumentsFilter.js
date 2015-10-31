let parseJson = (str) => {
  // http://stackoverflow.com/questions/24175802/missing-quotation-marks-on-keys-in-json
  str = str.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:([^\/])/g, '"$2":$4');
  try {
    return JSON.parse(str);
  } catch (e) {
    log('invalid json :( ', str, e);
    return false;
  }
};

Template.DocumentsFilter.onCreated(function () {
  this.invalidSelector = new ReactiveVar(null);
  this.invalidOptions = new ReactiveVar(null);
});

Template.DocumentsFilter.helpers({
  invalidSelector() {
    return Template.instance().invalidSelector.get();
  },

  invalidOptions() {
    return Template.instance().invalidOptions.get();
  },
  selector() {
    return Template.instance().data.selector;
  },
  options() {
    var options = JSON.stringify(Template.instance().data.options);
    return options;
  }
});

Template.DocumentsFilter.events({
  'submit form.documents-filter'(event, templateInstance) {
    event.preventDefault();
    const selector = event.currentTarget.selector.value;
    const options = event.currentTarget.options.value;

    templateInstance.invalidSelector.set(false);
    //
    let optionsJson = {};
    if (!!options) {
      optionsJson = parseJson(options);
      if (!optionsJson) {
        templateInstance.invalidOptions.set('Invalid JSON format');
        return false;
      }
    }
    templateInstance.invalidOptions.set(false);
    CurrentSession.documentsSelector = selector;
    CurrentSession.documentsOptions = optionsJson;

    let newId = FilterHistory.insert({
      createdAt: new Date(),
      name: null,
      selector: selector,
      options: optionsJson,
      skip: CurrentSession.documentsPaginationSkip,
      limit: CurrentSession.documentsPaginationLimit
    });

    FlowRouter.go(getFilterRoute(newId));
  }
});
