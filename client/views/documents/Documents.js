Template.Documents.onCreated(function () {
  this.autorun(() => {
    //log('> autorun 2');
    if (!CurrentSession.collection) return false;

    let selector = CurrentSession.documentsSelector || '{}';
    let options = CurrentSession.documentsOptions || {};
    options = deepClone(options);
    let paginationSkip = parseInt(CurrentSession.documentsPaginationSkip);
    let paginationLimit = parseInt(CurrentSession.documentsPaginationLimit);
    const limit = parseInt(options.limit) || null;
    const skip = parseInt(options.skip) || null;

    if ((!!limit && limit > paginationLimit) || !limit) {
      options.limit = paginationLimit;
    }

    options.skip = skip ? skip + paginationSkip : paginationSkip;

    //selector = EJSON.stringify(eval('(' + selector + ')'));
    //options = EJSON.stringify(eval('(' + options + ')'));
    CurrentSession.mongoCollectionSubscription = this.subscribe('externalCollection', CurrentSession.collection.name, selector, options, CurrentSession.documentsRandomSeed);
  });

  this.cursor = () => {
    return CurrentSession.mongoCollection ? CurrentSession.mongoCollection.find() : null;
  }
});

Template.Documents.helpers({
  documentsReady() {
    return CurrentSession.mongoCollectionSubscription.ready();
  },
  filterData() {
    return {
      collection: CurrentSession.collection,
      selector: CurrentSession.documentsSelector,
      options: CurrentSession.documentsOptions
    }
  },

  viewParameters() {
    if (!ConnectionStructureSubscription.ready()) return false;
    let documents = Template.instance().cursor().fetch();
    if (!documents) return false;

    let index = CurrentSession.documentsPaginationSkip + 1;
    _.each(documents, function(doc) {
      doc.drMongoIndex = index++ + '.';
    });
    return {documents: documents};
  },

  collection() {
    return CurrentSession.collection;
  },

  defaultSkip() {
    return CurrentSession.documentsPaginationSkip;
  },

  defaultLimit() {
    return CurrentSession.documentsPaginationLimit;
  }
});

Template.Documents.events({
  'click #refresh-documents'(event, templateInstance) {
    CurrentSession.documentsRandomSeed = Random.id();
  },
  'submit form.pagination-form'(event, templateInstance) {
    event.preventDefault();
    let form = event.currentTarget;

    CurrentSession.documentsPaginationSkip = parseInt(form.skip.value);
    CurrentSession.documentsPaginationLimit = parseInt(form.limit.value);
  },

  'click .pagination-form .previous'(event, templateInstance) {
    event.preventDefault();
    const paginationSkip = parseInt(CurrentSession.documentsPaginationSkip);
    const paginationLimit = parseInt(CurrentSession.documentsPaginationLimit);
    const skip = paginationSkip - paginationLimit;
    CurrentSession.documentsPaginationSkip = (skip >= 0 ? skip : 0);
  },

  'click .pagination-form .next'(event, templateInstance) {
    event.preventDefault();
    const paginationSkip = parseInt(CurrentSession.documentsPaginationSkip);
    const paginationLimit = parseInt(CurrentSession.documentsPaginationLimit);
    const skip = paginationSkip + paginationLimit;
    CurrentSession.documentsPaginationSkip = skip;
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
