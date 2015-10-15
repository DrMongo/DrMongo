Template.TreeRow.onCreated(function () {

  //log('> ROW data', this.data);
  let value = this.data.value;
  let key = this.data.key;
  let type = typeof value;

  let info = {
    formattedValue: typeof value,
    hasChildren: false,
    valueClass: type
  };
  if (key == '_id') {
    info['formattedValue'] = value;
    info['valueClass'] = 'id';
  } else if (_.isString(value)) {
    info['formattedValue'] = value;
  } else if (_.isNull(value)) {
    info['formattedValue'] = 'null';
    info['valueClass'] = 'null';
  } else if (_.isBoolean(value)) {
    info['formattedValue'] = value ? 'true' : 'false';
  } else if (_.isDate(value)) {
    info['formattedValue'] = value;
    info['valueClass'] = 'date';
  } else if (_.isArray(value)) {
    info['formattedValue'] = '[ ' + value.length + ' fields ]';
    info['valueClass'] = 'array';
    info['hasChildren'] = true;
  } else if (_.isObject(value)) {
    info['formattedValue'] = '{ ' + Object.keys(value).length + ' fields }';
    info['valueClass'] = 'object';
    info['hasChildren'] = true;
  }

  info.valueClass = 'value-' + info.valueClass;

  this.info = info;

});


Template.TreeRow.helpers({
  isLevel(level) {
    return this.level == level;
  },

  formattedValue() {
    return Template.instance().info.formattedValue;
  },

  hasChildren() {
    return Template.instance().info.hasChildren;
  },

  valueClass() {
    return Template.instance().info.valueClass;
  },

  isType(assertType) {
    let type = typeof this.value;
    if (this.key === '_id') type = 'string';
    return type === assertType
  },

  fields() {
    let fields = [];
    _.each(this.value, (value, key) => {
      fields.push({
        key: key,
        value: value
      })
    });
    return fields;
  },

  nextLevel() {
    return Template.instance().data.level + 1;
  },

  levelClass() {
    return this.level > 0 ? '' : 'document'
  }
});
