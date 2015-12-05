Template.Tree.onCreated(function () {
});

var clipboard = null;

Template.Tree.onRendered(function () {
  // auto open first document
  $(this.find('.toggle-children')).click();
});

Template.Tree.helpers({
	'zeroResults': function() {
		return this.documents.length == 0;
	},
	'pinnedColumns': function() {
		return CurrentSession.collection.pinnedColumnsFormatted;
	}
});
