let getRowInfo = (key, value, level, fullPath) => {
  let type = typeof value;

  let info = {
    keyValue: key,
    value: value,
    pinnedColumns: null,
    formattedValue: typeof value,
    notPrunedString: false,
    level: level,
    isPruned: false,
    hasChildren: false,
    valueClass: type,
    copyValue: false,
    isId: false,
    idValue: null,
    fullPath: fullPath,
    colspan: 2
  };

  if (resemblesId(value) || key == '_id') {
    info['formattedValue'] = '<a href="#" class="find-id">' + value + '</a>';
    info['valueClass'] = 'id';
    info['copyValue'] = value;
    info['idValue'] = value;
  } else if (_.isNumber(value)) {
    info['formattedValue'] = value;
    info['valueClass'] = 'number';
    info['copyValue'] = value;
  } else if (_.isString(value)) {
    if (value.length == 0) {
      info['formattedValue'] = "\"\" empty string";
      info['isPruned'] = value.length > 35;
      info['copyValue'] = value;
      info['notPrunedString'] = value;
      info['valueClass'] = 'null';
    } else {
      info['formattedValue'] = s(value).prune(35).value();
      info['isPruned'] = value.length > 35;
      info['copyValue'] = value;
      info['notPrunedString'] = value;
    }
  } else if (_.isNull(value)) {
    info['formattedValue'] = 'null';
    info['valueClass'] = 'null';
  } else if (_.isBoolean(value)) {
    info['formattedValue'] = value ? 'true' : 'false';
  } else if (_.isDate(value)) {
    info['formattedValue'] = moment(value).format(Settings.dateFormat);
    info['valueClass'] = 'date';
    info['copyValue'] = info['formattedValue'];
  } else if (_.isArray(value)) {
    info['formattedValue'] = '[ ' + value.length + ' items ]';
    info['valueClass'] = 'array';
    info['hasChildren'] = true;
    info['copyValue'] = JSON.stringify(value);
  } else if (_.isObject(value)) {
    info['formattedValue'] = '{ ' + Object.keys(value).length + ' fields }';
    info['valueClass'] = 'object';
    info['hasChildren'] = true;
    info['copyValue'] = JSON.stringify(value);
  }

  if (!info['hasChildren']) {
    // log(CurrentSession.collection.pinnedColumnsFormatted, fullPath, _.contains(CurrentSession.collection.pinnedColumnsFormatted, fullPath))
    info['isPinned'] = _.contains(CurrentSession.collection.pinnedColumns, fullPath)
  }

  info.valueClass = 'value-' + info.valueClass;

  if (level == 0) {
    let pinnedColumns = [];
    if (CurrentSession.collection.pinnedColumnsFormatted && CurrentSession.collection.pinnedColumnsFormatted.length > 0) {
      _.each(CurrentSession.collection.pinnedColumnsFormatted, (column) => {
        try {
          // todo remove eval
          let t = eval('(value.' + column + ')');
          pinnedColumns.push(t);
        }
        catch (error) {
          // do nothing
        }

      })
    } else {
      if (value.name) {
        pinnedColumns.push(value.name);
      } else if (value.title) {
        pinnedColumns.push(value.title);
      }
    }
    if (pinnedColumns.length) {
      info.pinnedColumns = pinnedColumns;
      info.colspan += pinnedColumns.length;
    }

    info.drMongoIndex = value.drMongoIndex;
    delete value.drMongoIndex;
  }

  if (info.hasChildren) {
    let fields = [];
    let id = null;
    _.each(value, (v, k) => {
      if (k == '_id') {
        id = v;
        return;
      }

      fields.push({
        key: k,
        value: v
      })
    });

    fields = _.sortBy(fields, 'key');
    if (id) fields.unshift({key: '_id', value: id});

    info.children = [];
    _.each(fields, (v) => {
      info.children.push(getRowInfo(v.key, v.value, level + 1, fullPath + '.' + v.key));
    });
  }
  return info;
};

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
  this.renderChildren = new ReactiveVar(false);

  let key = this.data._id;
  let value = this.data;
  let info = getRowInfo(typeof key == 'string' ? key : key._str, value, 0, '');
  //log('> info', info);

  this.info = info;
});

Template.TreeDocument.helpers({
  info() {
    return Template.instance().info;
  },

  renderChildren() {
    return Template.instance().renderChildren.get();
  }
});

Template.TreeDocument.events({
  'click .toggle-children'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    Template.instance().renderChildren.set(true);

    $(event.currentTarget).next('.children').toggleClass('hidden');
  },

  'click .copy-value'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    copyText($(event.currentTarget).attr('data-clipboard-text'));
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
        sAlert.success('Document duplicated with new _ID: ' + result)
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

    log(this.idValue)
    Meteor.call('findCollectionForDocumentId', CurrentSession.database._id, this.idValue, (error, result) => {
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
      Session.set('showLoader', false);
    });
  }

});
