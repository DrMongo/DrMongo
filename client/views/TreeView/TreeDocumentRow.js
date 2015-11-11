Template.TreeDocumentRow.onCreated(function () {
  this.renderChildren = new ReactiveVar(false);
});


Template.TreeDocumentRow.helpers({
  renderChildren() {
    return Template.instance().renderChildren.get();
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
    if ($(event.target).parent().is('.control-icon')) return true;

    event.preventDefault();
    event.stopImmediatePropagation();
    Template.instance().renderChildren.set(true);
    $(event.currentTarget).parent('.parent').toggleClass('collapsed');
  }
});
