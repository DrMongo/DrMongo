shortcuts.register('Documents list', ['r', 'R'], ['R'], 'Refresh list', function() { $('#refresh-documents').click() });
shortcuts.register('Documents list', ['c', 'C'], ['C'], 'Clear filter', function() { $('#reset-filter').click() });
shortcuts.register('Documents list', ['n', 'N'], ['N'], 'Previous page', function() { $('.pagination-previous').click() });
shortcuts.register('Documents list', ['m', 'M'], ['M'], 'Next page', function() { $('.pagination-next').click() });



Template.Documents.onCreated(function () {
  this.autorun(() => {
    //log('> autorun 2');
    if (!CurrentSession.collection) return false;

    let filter = CurrentSession.documentsFilter || '{}';
    Session.set('showLoader', true);

    CurrentSession.documentsReady = false;
    Meteor.call('getDocuments', CurrentSession.database._id, CurrentSession.collection.name, filter, CurrentSession.documentsPagination, CurrentSession.documentsRandomSeed, function(error, result) {
      if (result == false) {
        alert('Filter incorrect...');
        return false;
      }
      CurrentSession.documents = result.docs;
      CurrentSession.documentsCount = result.count;
      CurrentSession.documentsReady = true;
      Session.set('showLoader', false);

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
      filter: CurrentSession.documentsFilter
    }
  },

  viewParameters() {
    if (!ConnectionStructureSubscription.ready()) return false;
    let documents = CurrentSession.documents || false;
    if (!documents) return false;

    let index = (CurrentSession.documentsPagination * CurrentSession.documentsPaginationLimit) + 1;
    _.each(documents, function(doc) {
      doc.drMongoIndex = index++ + '.';
    });
    return {documents: documents};
  },

  collection() {
    return CurrentSession.collection;
  },

  savedFilters() {
    if (!CurrentSession.collection) return false;
    return FilterHistory.find({name: {$ne: null}, collection_id: CurrentSession.collection._id});
  }
});

Template.Documents.events({
  'click #refresh-documents'(event, templateInstance) {
    refreshDocuments();
  },

  'click #reset-filter'(event, templateInstance) {
    FlowRouter.go(getFilterRoute());
  },

  'click #save-filter'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();

    let filterId = FlowRouter.getParam('filter');
    if (filterId) {
      let name = prompt('Give filter a name to save it:');
      FilterHistory.update(filterId, {$set: {name: name}});
    }
  },

  'click #saved-filters li a:not(#save-filter)'(event, templateInstance) {
    event.preventDefault();
    FlowRouter.go(getFilterRoute(this._id));
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
