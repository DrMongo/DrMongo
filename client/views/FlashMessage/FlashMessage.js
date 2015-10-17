Session.setDefault('flashMessage', null);
flashMessageTimout = null;

showFlashMessage = function(fm) {
  Meteor.clearTimeout(flashMessageTimout);
  Session.set('flashMessage', fm);
  flashMessageTimout = Meteor.setTimeout(hideFlashMessage, 10000);
}

hideFlashMessage = function() {
  Session.set('flashMessage', null);
}

Template.FlashMessage.onRendered(function() {
});

Template.FlashMessage.helpers({
  show: function () {
    return !Session.equals('flashMessage', null);
  },
  message: function () {
    var fm = Session.get('flashMessage');
    if (fm && fm.message) return fm.message;
  }
});
