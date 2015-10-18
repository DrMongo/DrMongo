Template.Documents.onCreated(function () {
  this.routeParameters = new ReactiveVar(null);
  var parameters = validateRouteUrl();
  this.filterSelector = new ReactiveVar({});
  this.filterOptions = new ReactiveVar({});

  this.autorun(() => {
    var parameters = validateRouteUrl();
    const collectionName = FlowRouter.getParam('collection') || null;
    this.routeParameters.set(parameters);

    this.externalCollection = cm.mountCollection(parameters.collection);
    this.subscribe('externalCollection', parameters.collection.name);
  });

  this.cursor = () => {
    let selector = this.filterSelector.get() || {};
    let options = this.filterOptions.get() || {};

    return this.externalCollection ? this.externalCollection.find(selector, options) : null;
  }
});

Template.Documents.helpers({
  filterData() {
    let instance = Template.instance();
    return {
      onSubmit: (selection, options) => {
        instance.filterSelector.set(selection);
        instance.filterOptions.set(options);
      }
    }
  },

  viewParams() {
    if (!Template.instance().subscriptionsReady()) return false;
    return {documents: Template.instance().cursor() || false};
  },

  collection() {
    return Template.instance().routeParameters.get().collection;
  }
});

Template.Documents.events({
});
