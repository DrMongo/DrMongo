let defaultSkip = 0;
let defaultLimit = 20;
allCollections = null;

Template.Documents.onCreated(function () {
  this.routeParameters = new ReactiveVar(null);
  let parameters = validateRouteUrl();
  this.filterSelector = new ReactiveVar('{}');
  this.filterOptions = new ReactiveVar('{}');
  this.paginationSkip = new ReactiveVar(defaultSkip);
  this.paginationLimit = new ReactiveVar(defaultLimit);
  seo.setTitle(parameters.collection.name);

  this.externalCollection = null;
  let externalCollectionSubscription = null;
  this.autorun(() => {
    //log('> autorun 1');
    const collectionName = FlowRouter.getParam('collection') || null; // fire autorun
    let parameters = validateRouteUrl();
    this.routeParameters.set(parameters);

    if (externalCollectionSubscription) {
      //log('> stop!!!');
      externalCollectionSubscription.stop();
    }
    if (!allCollections) {
      log('tu som')
      allCollections = cm.mountAllCollections(parameters.database);
    }
    this.externalCollection = allCollections[parameters.collection._id];
  });


  this.autorun(() => {
    //log('> autorun 2');
    const collectionName = FlowRouter.getParam('collection') || null; // fire autorun
    let selector = this.filterSelector.get() || '{}';
    let options = this.filterOptions.get() || '{}';
    options = deepClone(options);
    let paginationSkip = parseInt(this.paginationSkip.get()) || defaultSkip;
    let paginationLimit = parseInt(this.paginationLimit.get()) || defaultLimit;
    const limit = parseInt(options.limit) || null;
    const skip = parseInt(options.skip) || null;

    if ((!!limit && limit > paginationLimit) || !limit) {
      options.limit = paginationLimit;
    }

    options.skip = skip ? skip + paginationSkip : paginationSkip;

    //selector = EJSON.stringify(eval('(' + selector + ')'));
    //options = EJSON.stringify(eval('(' + options + ')'));

    externalCollectionSubscription = this.subscribe('externalCollection', collectionName, selector, options);
  });

  this.cursor = () => {
    //log(this.externalCollection.findOne({_id: /MY2/}));
    return this.externalCollection ? this.externalCollection.find() : null;
  }
});

Template.Documents.helpers({
  filterData() {
    let instance = Template.instance();
    return {
      onSubmit: (selector, options) => {
        instance.filterSelector.set(selector);
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
      connectionId: templateInstance.routeParameters.get().connection._id,
      databaseId: templateInstance.routeParameters.get().database._id,
      collectionId: templateInstance.routeParameters.get().collection._id
    });
    $('#DocumentInsertModal').modal('show');
  }

});
