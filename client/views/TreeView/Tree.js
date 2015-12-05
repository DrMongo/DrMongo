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
		if (CurrentSession.collection.pinnedColumnsFormatted) {
			return CurrentSession.collection.pinnedColumnsFormatted;
		} else if (this.documents.length > 0) {
			if (this.documents[0].name) return ['name'];
			if (this.documents[0].title) return ['title'];
		}
	}
});
