Template.Pagination.helpers({
  pages() {
    const count = Math.floor(CurrentSession.documentsCount / CurrentSession.documentsPaginationLimit) + 1;
    let pages = [];
    for (var i = 1; i <= count; i++) {
      pages.push({
        label: i
      });
    }
    return pages;
  },

  currentPage() {
    return (CurrentSession.documentsPaginationSkip / CurrentSession.documentsPaginationLimit) + 1
  },

  totalCount() {
    return CurrentSession.documentsCount;
  }
});


Template.Pagination.events({
  'click .pagination-page'(event, templateInstance) {
    event.preventDefault();
    const page = event.currentTarget.dataset.page;
    const paginationLimit = parseInt(CurrentSession.documentsPaginationLimit);
    CurrentSession.documentsPaginationSkip = paginationLimit * (page - 1);
  },

  'click .pagination-first'(event, templateInstance) {
    event.preventDefault();
    CurrentSession.documentsPaginationSkip = 0;
  },

  'click .pagination-last'(event, templateInstance) {
    event.preventDefault();
    const last = Math.floor(CurrentSession.documentsCount / CurrentSession.documentsPaginationLimit);
    CurrentSession.documentsPaginationSkip = last * CurrentSession.documentsPaginationLimit;
  },

  'click .pagination-previous'(event, templateInstance) {
    event.preventDefault();
    const paginationSkip = parseInt(CurrentSession.documentsPaginationSkip);
    const paginationLimit = parseInt(CurrentSession.documentsPaginationLimit);
    const skip = paginationSkip - paginationLimit;
    CurrentSession.documentsPaginationSkip = (skip >= 0 ? skip : 0);
  },

  'click .pagination-next'(event, templateInstance) {
    event.preventDefault();
    const paginationSkip = parseInt(CurrentSession.documentsPaginationSkip);
    const paginationLimit = parseInt(CurrentSession.documentsPaginationLimit);
    CurrentSession.documentsPaginationSkip = paginationSkip + paginationLimit;
  }
});
