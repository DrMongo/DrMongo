

let deleteHintTimeout = null;
let showDeleteHint = (show = true) => {
  // first stop previous timeout if exists
  if(deleteHintTimeout) Meteor.clearTimeout(deleteHintTimeout);

  if(show) {
    deleteHintTimeout = Meteor.setTimeout(() => {
      sAlert.info('Psst!! Hey you! Try double click...');
    }, 300);
  }
};


Template.TreeDocument.onCreated(function () {
  if (!CurrentSession.collection) return false;
  this.renderChildren = new ReactiveVar(false);

  let key = this.data._id;
  let value = this.data;
  let info = TreeViewUrils.getRowInfo(typeof key == 'string' ? key : key._str, value, 0, '');
  //log('> info', info);

  this.info = info;
});

Template.TreeDocument.helpers({
  info() {
    return Template.instance().info;
  },

  children() {
    return Template.instance().renderChildren.get() ? TreeViewUrils.getChildren(Template.instance().data, Template.instance().info) : null;
  }
});

Template.TreeDocument.events({
  'click .toggle-children'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    templateInstance.renderChildren.set(true);

    $(event.currentTarget).next('.children').toggleClass('hidden');
  },

  'click .copy-value'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    copyText(EJSON.stringify(Template.currentData()));
  },

  'click .pin-column'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    var path = $(event.currentTarget).attr('data-full-path');

    var pathFormatted = path.replace(/^\./, '');
    pathFormatted = pathFormatted.replace(/\.([0-9]+)$/g, '[$1]');
    pathFormatted = pathFormatted.replace(/\.([0-9]+)\./g, '[$1].');

    var c = Collections.findOne(CurrentSession.collection._id);
    if (c && c.pinnedColumns && _.contains(c.pinnedColumns, path)) {
      Collections.update(CurrentSession.collection._id, {$pull: {pinnedColumns: path, pinnedColumnsFormatted: pathFormatted}});
    } else {
      Collections.update(CurrentSession.collection._id, {$addToSet: {pinnedColumns: path, pinnedColumnsFormatted: pathFormatted}});
    }
  },

  'click .edit-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();

    Session.set('DocumentEditorModal', {
      connectionId: CurrentSession.connection._id,
      databaseId: CurrentSession.database._id,
      collectionId: CurrentSession.collection._id,
      documentId: this.value._id,
      document: this.value
    });
    $('#DocumentEditorModal').modal('show');
  },

  'click .view-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();

    Session.set('DocumentViewerModal', {
      connectionId: CurrentSession.connection._id,
      databaseId: CurrentSession.database._id,
      collectionId: CurrentSession.collection._id,
      documentId: this.value._id,
      document: this.value
    });
    $('#DocumentViewerModal').modal('show');
  },

  'click .duplicate-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    Meteor.call('duplicateDocument', CurrentSession.collection._id, this.value._id, function (error, result) {
      if (!error) {
        sAlert.success('Document duplicated.')
        refreshDocuments();
      } else {
        sAlert.error('Could NOT duplicate document. Probably due to unique index.')
      }
    });
  },

  'dblclick .delete-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    showDeleteHint(false);
    Meteor.call('removeDocument', CurrentSession.collection._id, this.value._id, function(error, result) {
      refreshDocuments();
    })
  },

  'click .delete-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    showDeleteHint();
  },

  'click .view-value'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();

    Session.set('ViewValueModal', {
      title: this.keyValue,
      value: this.notPrunedString
    });
    $('#ViewValueModal').modal('show');
  },

  'click a.find-id'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    Session.set('showLoader', true);

    Meteor.call('findCollectionForDocumentId', CurrentSession.database._id, this.idValue, (error, result) => {
      if (result === null) {
        sAlert.warning('Document not found.');
        Session.set('showLoader', false);
      }
      let c = Collections.findOne({database_id: CurrentSession.database._id, name: result});
      if (c) {
        const data = {
          collection: c.name,
          database: c.database().name,
          connection: c.database().connection().slug
        };

        goTo(FlowRouter.path('Documents', data));

        CurrentSession.documentsFilter = this.idValue;
        CurrentSession.documentsPagination = 0;

        let newId = FilterHistory.insert({
          createdAt: new Date(),
          collection_id: CurrentSession.collection._id,
          name: null,
          filter: this.idValue
        });

        FlowRouter.go(getFilterRoute(newId));

      }
    });
  }

});
