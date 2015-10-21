let getRowInfo = (key, value) => {
  log('> getRowInfo', key, value);
  let type = typeof value;

  let info = {
    formattedValue: typeof value,
    isPruned: false,
    hasChildren: false,
    valueClass: type,
    copyValue: false
  };
  if (key == '_id') {
    info['formattedValue'] = value;
    info['valueClass'] = 'id';
  } else if (_.isString(value)) {
    info['formattedValue'] = s(value).prune(35).value();
    info['isPruned'] = value.length > 35;
  } else if (_.isNull(value)) {
    info['formattedValue'] = 'null';
    info['valueClass'] = 'null';
  } else if (_.isBoolean(value)) {
    info['formattedValue'] = value ? 'true' : 'false';
  } else if (_.isDate(value)) {
    info['formattedValue'] = value;
    info['valueClass'] = 'date';
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

  if(info.hasChildren) {
    let fields = [];
    let id = null;
    _.each(value, (v, k) => {
      if(k == '_id') {
        id = v;
        return;
      }

      fields.push({
        key: k,
        value: v
      })
    });

    fields = _.sortBy(fields, 'key');
    if(id) fields.unshift({key: '_id', value: id});

    info.children = [];
    log('>fields', fields);
    _.each(fields, (v) => {
      info.children.push(getRowInfo(v.key, v.value));
    });
  }

  return info;
};


Template.TreeDocument.onCreated(function () {
  let key = this.data._id;
  let value = this.data;
  //let info = getRowInfo(typeof key == 'string' ? key : key._str, value);
  //log(info);
});

Template.TreeDocument.helpers({
  keyData() {
    return typeof this._id == 'string' ? this._id : this._id._str;
  },

  valueData() {
    return this;
  }
});

Template.TreeDocument.events({
  'click .edit-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();

    Session.set('DocumentEditorModal', {
      connectionId: getRouteParameters().connection._id,
      databaseId: getRouteParameters().database._id,
      collectionId: getRouteParameters().collection._id,
      documentId: this.value._id,
      document: this.value
    });
    $('#DocumentEditorModal').modal('show');
  },
  'click .duplicate-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    Meteor.call('duplicateDocument', getRouteParameters().collection._id, this.value._id, function(error, result) {
      log(error, result)
      if (!error) {
        sAlert.success('Document duplicated with new _ID: ' + result)
      }
    });
  },
  'click .delete-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
  },
  'dblclick .delete-document'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();

    Meteor.call('removeDocument', getRouteParameters().collection._id, this.value._id)
  },
  'click .view-value'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    log('view value event', this);

    Session.set('ViewValueModal', {
      title: this.key,
      value: this.value
    });
    $('#ViewValueModal').modal('show');
  }

});
