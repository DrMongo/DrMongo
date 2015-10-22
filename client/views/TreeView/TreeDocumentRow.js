Template.TreeDocumentRow.onCreated(function () {
  this.renderChildren = new ReactiveVar(false);
});


Template.TreeDocumentRow.helpers({
  renderChildren() {
    if(this.level == 0) {
      return Template.instance().renderChildren.get();
    } else {
      return this.hasChildren;
    }
  },

  isLevel(level) {
    return this.level == level;
  },

  nextLevel() {
    return this.level + 1;
  },

  levelClass() {
    return this.level > 0 ? '' : 'document'
  }
});

Template.TreeDocumentRow.events({
  'click .toggle-children'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    Template.instance().renderChildren.set(true);
    $(event.currentTarget).parent('.parent').toggleClass('collapsed');
  }
});
