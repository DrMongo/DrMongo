Template.breadcrumb.helpers({
  breadcrumb() {
    return breadcrumb.getPath().get();
  },

  isLast() {
    return !!this.last
  }
});
