Template.TreeDocumentRow.events({
  'click .toggle-children'(event, templateInstance) {
    if ($(event.target).parent().is('.control-icon')) return true;

    event.preventDefault();
    event.stopImmediatePropagation();

    $(event.currentTarget).parent('.parent').toggleClass('collapsed');
  }
});
