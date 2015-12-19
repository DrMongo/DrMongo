Template.TreeDocumentRow.onCreated(function() {
  this.renderChildren = new ReactiveVar(false);
});

Template.TreeDocumentRow.helpers({
  children() {
    return Template.instance().renderChildren.get() ? TreeViewUtils.getChildren(Template.instance().data) : null;
  }
});

Template.TreeDocumentRow.events({
  'click .toggle-children'(event, templateInstance) {
    if ($(event.target).parent().is('.control-icon')) return true;

    event.preventDefault();
    event.stopImmediatePropagation();
    templateInstance.renderChildren.set(true);

    $(event.currentTarget).parent('.parent').toggleClass('collapsed');
  },
  'click .copy-value'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    copyText(EJSON.stringify(this.value));
  }
});
