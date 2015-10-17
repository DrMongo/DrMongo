Template.Documents.onCreated(function () {
  var parameters = validateRouteUrl();
  this.routeParameters = new ReactiveVar(parameters);
  this.filterSelection = new ReactiveVar(null);
  this.filterOptions = new ReactiveVar({});

  this.collection = null;
  this.autorun(() => {
    if(FlowRouter.subsReady("connectionStructure")) {
      //log('> parameters', parameters);
      let collection = parameters.collection;
      Tracker.nonreactive(() => {
        this.collection = cm.mountCollection(collection._id);
        this.subscribe('externalCollection', collection._id);
      });
    }
  });

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
