Template.Pagination.helpers({
  pages() {
    const count = Math.ceil(CurrentSession.documentsCount / CurrentSession.documentsPaginationLimit);

    if (count > 20) {
      var firstPage = CurrentSession.documentsPagination - 10;
      if (firstPage < 0) firstPage = 0;

      var lastPage = CurrentSession.documentsPagination + 10;
      if (lastPage > count) lastPage = count;
    } else {
      var firstPage = 0;
      var lastPage = count;      
    }
    let pages = [];
    for (var i = firstPage; i < lastPage; i++) {
      pages.push({
        index: i,
        label: (i+1) + '. page'
      });
    }
    return pages;
  },

  currentPage() {
    return CurrentSession.documentsPagination + 1;
  },

  totalCount() {
    return CurrentSession.documentsCount;
  },
  prevInactive() {
    return CurrentSession.documentsPagination == 0 ? 'inactive' : '';
  },
  nextInactive() {
    const count = Math.ceil(CurrentSession.documentsCount / CurrentSession.documentsPaginationLimit);
    return (CurrentSession.documentsPagination == count - 1) ? 'inactive' : '';
  }
});


Template.Pagination.events({
  'click .pagination-page'(event, templateInstance) {
    event.preventDefault();
    const page = event.currentTarget.dataset.page;
    CurrentSession.documentsPagination = parseInt(page) || 0;
    FlowRouter.go(getFilterRoute(null, CurrentSession.documentsPagination))
  },

  'click .pagination-first'(event, templateInstance) {
    event.preventDefault();
    CurrentSession.documentsPagination = 0;
    FlowRouter.go(getFilterRoute(null, CurrentSession.documentsPagination))
  },

  'click .pagination-last'(event, templateInstance) {
    event.preventDefault();
    CurrentSession.documentsPagination = Math.ceil(CurrentSession.documentsCount / CurrentSession.documentsPaginationLimit) - 1;
    FlowRouter.go(getFilterRoute(null, CurrentSession.documentsPagination))
  },

  'click .pagination-previous'(event, templateInstance) {
    event.preventDefault();
    var page = CurrentSession.documentsPagination - 1;
    CurrentSession.documentsPagination = (page >= 0 ? page : 0);
    FlowRouter.go(getFilterRoute(null, CurrentSession.documentsPagination))
  },

  'click .pagination-next'(event, templateInstance) {
    event.preventDefault();
    var page = CurrentSession.documentsPagination + 1;
    var totalPages = Math.ceil(CurrentSession.documentsCount / CurrentSession.documentsPaginationLimit)
    CurrentSession.documentsPagination = (page < totalPages ? page : totalPages - 1);
    FlowRouter.go(getFilterRoute(null, CurrentSession.documentsPagination))
  }
});
