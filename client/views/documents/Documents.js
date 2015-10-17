Template.Documents.onCreated(function () {
  var parameters = validateRouteUrl();
  this.routeParameters = new ReactiveVar(parameters);
  this.filterSelection = new ReactiveVar({});
  this.filterOptions = new ReactiveVar({});

  this.collection = cm.mountCollection(parameters.collection);
  this.subscribe('externalCollection', parameters.collection.name);

  this.cursor = () => {
    let selector = this.filterSelection.get() || {};
    let options = this.filterOptions.get() || {};

    return this.collection ? this.collection.find(selector, options) : null;
  }
});

Template.Documents.helpers({
  filterData() {
    let instance = Template.instance();
    return {
      onSubmit: (selection, options) => {
        instance.filterSelection.set(selection);
        instance.filterOptions.set(options);
      }
    }
  },

  viewParams() {
    if (!Template.instance().subscriptionsReady()) return false;
    return {documents: Template.instance().cursor() || false};
  }
});

Template.Documents.events({
});
