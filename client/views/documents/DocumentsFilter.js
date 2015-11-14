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
  this.invalidFilter = new ReactiveVar(null);
});

Template.DocumentsFilter.helpers({
  invalidFilter() {
    return Template.instance().invalidFilter.get();
  },

  filter() {
    return Template.instance().data.filter;
  }
});

Template.DocumentsFilter.events({
  'submit form.documents-filter'(event, templateInstance) {
    event.preventDefault();
    const filter = event.currentTarget.filter.value;

    templateInstance.invalidFilter.set(false);

    CurrentSession.documentsFilter = filter;

    let newId = FilterHistory.insert({
      createdAt: new Date(),
      name: null,
      filter: filter
    });

    FlowRouter.go(getFilterRoute(newId));
  }
});
