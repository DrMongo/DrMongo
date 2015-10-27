let getRowInfo = (key, value, level) => {
  let type = typeof value;

  let info = {
    keyValue: key,
    value: value,
    formattedValue: typeof value,
    notPrunedString: false,
    level: level,
    isPruned: false,
    hasChildren: false,
    valueClass: type,
    copyValue: false,
    isId: false,
    idValue: null
  };

  if (resemblesId(value) || key == '_id') {
    info['formattedValue'] = value;
    info['valueClass'] = 'id';
    info['copyValue'] = value;
    info['isId'] = true;
    info['idValue'] = value;
  } else if (_.isNumber(value)) {
    info['formattedValue'] = value;
    info['valueClass'] = 'number';
    info['copyValue'] = value;
  } else if (_.isString(value)) {
    info['formattedValue'] = s(value).prune(35).value();
    info['isPruned'] = value.length > 35;
    info['copyValue'] = value;
    info['notPrunedString'] = value;
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

  info.valueClass = 'value-' + info.valueClass;

  if (level == 0) {
    let pinnedColumns = [];
    if (CurrentSession.collection.pinnedColumns && CurrentSession.collection.pinnedColumns.length > 0) {
      _.each(CurrentSession.collection.pinnedColumns, (column) => {
        try {
          // todo remove eval
          let t = eval('(value.' + column + ')');
          if (t) pinnedColumns.push(t);
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
      info.keyValue += ' <small>' + info.formattedValue + '</small>';
      info.formattedValue = pinnedColumns.join('; ');
    }
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
      info.children.push(getRowInfo(v.key, v.value, level + 1));
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
  let key = this.data._id;
  let value = this.data;
  let info = getRowInfo(typeof key == 'string' ? key : key._str, value, 0);
  //log('> info', info);

  this.info = info;
});

Template.TreeDocument.helpers({
  info() {
    return Template.instance().info;
  }
});

Template.TreeDocument.events({
  'click .copy-value'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    copyText($(event.currentTarget).attr('data-clipboard-text'));
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
    Meteor.call('removeDocument', CurrentSession.collection._id, this.value._id)
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
  'click .find-id'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();

    Meteor.call('findCollectionForDocumentId', CurrentSession.database._id, this.idValue, (error, result) => {
      let c = Collections.findOne({database_id: CurrentSession.database._id, name: result});
      if (c) {
        CurrentSession.documentsSelector = this.idValue;
        CurrentSession.documentsOptions = {};
        const data = {
          collection: c.name,
          database: c.database().name,
          connection: c.database().connection().slug
        };

        goTo(FlowRouter.path('Documents', data));
      }
    });
  }

});
