Template.Pagination.helpers({
  pages() {
    const count = Math.ceil(CurrentSession.documentsCount / CurrentSession.documentsPaginationLimit);
    let pages = [];
    for (var i = 0; i < count; i++) {
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
