let defaultSkip = 0;
let defaultLimit = 20;

Template.Documents.onCreated(function () {
  this.routeParameters = new ReactiveVar(null);
  let parameters = validateRouteUrl();
  this.filterSelector = new ReactiveVar({});
  this.filterOptions = new ReactiveVar({});
  this.paginationSkip = new ReactiveVar(defaultSkip);
  this.paginationLimit = new ReactiveVar(defaultLimit);

  let externalCollection = null;
  this.autorun(() => {
    const collectionName = FlowRouter.getParam('collection') || null; // fire autorun
    var parameters = validateRouteUrl();
    this.routeParameters.set(parameters);

    externalCollection = cm.mountCollection(parameters.collection);
    this.subscribe('externalCollection', parameters.collection.name);

  });

  this.autorun(() => {
    let selector = this.filterSelector.get() || {};
    let options = this.filterOptions.get() || {};
    options = deepClone(options);
    let paginationSkip = parseInt(this.paginationSkip.get()) || defaultSkip;
    let paginationLimit = parseInt(this.paginationLimit.get()) || defaultLimit;
    const limit = parseInt(options.limit) || null;
    const skip = parseInt(options.skip) || null;

    if((!!limit && limit > paginationLimit) || !limit) {
      options.limit = paginationLimit;
    }

    options.skip = skip ? skip + paginationSkip : paginationSkip;

    log('> options', options, skip, paginationSkip);
    this.subscribe('externalCollection', parameters.collection.name, selector, options);
  });

  this.cursor = () => {
    return externalCollection ? externalCollection.find() : null;
  }
});

Template.Documents.helpers({
  filterData() {
    let instance = Template.instance();
    return {
      onSubmit: (selection, options) => {
        instance.filterSelector.set(selection);
        instance.filterOptions.set(options);
      },
      collection: instance.routeParameters.get().collection
    }
  },

  viewParameters() {
    if (!Template.instance().subscriptionsReady()) return false;
    return {documents: Template.instance().cursor() || false};
  },

  collection() {
    return Template.instance().routeParameters.get().collection;
  },

  defaultSkip() {
    return Template.instance().paginationSkip.get();
  },

  defaultLimit() {
    return Template.instance().paginationLimit.get();
  }
});

Template.Documents.events({
  'submit form.pagination-form'(event, templateInstance) {
    event.preventDefault();
    let form = event.currentTarget;

    templateInstance.paginationSkip.set(parseInt(form.skip.value));
    templateInstance.paginationLimit.set(parseInt(form.limit.value));
  },

  'click .pagination-form .previous'(event, templateInstance) {
    event.preventDefault();
    const paginationSkip = parseInt(templateInstance.paginationSkip.get());
    const paginationLimit = parseInt(templateInstance.paginationLimit.get());
    const skip = paginationSkip - paginationLimit;
    templateInstance.paginationSkip.set(skip >= 0 ? skip : 0);
  },

  'click .pagination-form .next'(event, templateInstance) {
    event.preventDefault();
    const paginationSkip = parseInt(templateInstance.paginationSkip.get());
    const paginationLimit = parseInt(templateInstance.paginationLimit.get());
    const skip = paginationSkip + paginationLimit;
    templateInstance.paginationSkip.set(skip);
  },
  'click #insert-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    Session.set('DocumentInsertModal', {
      connectionId: getRouteParameters().connection._id,
      databaseId: getRouteParameters().database._id,
      collectionId: getRouteParameters().collection._id
    });
    $('#DocumentInsertModal').modal('show');
  },

});
