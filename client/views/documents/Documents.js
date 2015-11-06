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

    CurrentSession.documentsReady = false;
    Meteor.call('getDocuments', CurrentSession.database._id, CurrentSession.collection.name, selector, CurrentSession.documentsOptions, options, CurrentSession.documentsRandomSeed, function(error, result) {
      CurrentSession.documents = result.docs;
      CurrentSession.documentsCount = result.count;
      CurrentSession.documentsReady = true;

    });
  });
});

Template.Documents.helpers({
  documentsReady() {
    return CurrentSession.documentsReady;
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
    let documents = CurrentSession.documents || false;
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
  },
  totalCount() {
    return Counts.get('documents');
  },
  savedFilters() {
    return FilterHistory.find({name: {$ne: null}});
  }
});

Template.Documents.events({
  'click #refresh-documents'(event, templateInstance) {
    CurrentSession.documentsRandomSeed = Random.id();
  },
  'click #reset-filter'(event, templateInstance) {
    CurrentSession.documentsSelector = '{}';
    CurrentSession.documentsOptions = {};
    CurrentSession.documentsPaginationSkip = 0;
    CurrentSession.documentsPaginationLimit = 20;
    FlowRouter.go(getFilterRoute())
  },
  'click #save-filter'(event, templateInstance) {
    let filterId = FlowRouter.getParam('filter');
    if (filterId) {
      let name = prompt('Give filter a name to save it:');
      FilterHistory.update(filterId, {$set: {name: name}});
    }
  },
  'click #saved-filters li a'(event, templateInstance) {
    event.preventDefault();
    FlowRouter.go(getFilterRoute(this._id));
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
