Template.Sidebar.onCreated(function () {
});

Template.Sidebar.helpers({
  collections() {
    return CurrentSession.database.collections();
  },
  isActive() {
    if (!CurrentSession.collection) return false;
    return CurrentSession.collection._id == this._id ? 'active' : '';
  },
  database() {
    return CurrentSession.database;
  }
});
