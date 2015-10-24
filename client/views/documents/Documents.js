let defaultSkip = 0;
let defaultLimit = 20;

Template.Documents.onCreated(function () {
  this.paginationSkip = new ReactiveVar(defaultSkip);
  this.paginationLimit = new ReactiveVar(defaultLimit);
  seo.setTitle(CurrentSession.collection.name);

  this.autorun(() => {
    //log('> autorun 2');
    let selector = CurrentSession.documentsSelector || '{}';
    let options = CurrentSession.documentsOptions || {};
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
    CurrentSession.mongoCollectionSubscription = this.subscribe('externalCollection', CurrentSession.collection.name, selector, options);
  });

  this.cursor = () => {
    return CurrentSession.mongoCollection ? CurrentSession.mongoCollection.find() : null;
  }
});

Template.Documents.helpers({
  filterData() {
    return {
      collection: CurrentSession.collection,
      selector: CurrentSession.documentsSelector,
      options: CurrentSession.documentsOptions
    }
  },

  viewParameters() {
    if (!ConnectionStructureSubscription.ready()) return false;
    return {documents: Template.instance().cursor() || false};
  },

  collection() {
    return CurrentSession.collection;
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
      connectionId: CurrentSession.connection._id,
      databaseId: CurrentSession.database._id,
      collectionId: CurrentSession.collection._id
    });
    $('#DocumentInsertModal').modal('show');
  }

});
