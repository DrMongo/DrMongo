Template.TreeRow.onCreated(function () {

  let value = this.data.value;
  let key = this.data.key;
  let type = typeof this.value;

  let info = {
    formattedValue: typeof value,
    hasChildren: false
  };
  if (key == '_id') {
    info['formattedValue'] = value;
  } else if (_.isString(value)) {
    info['formattedValue'] = value;
  } else if (_.isNull(value)) {
    info['formattedValue'] = 'null';
  } else if (_.isBoolean(value)) {
    info['formattedValue'] = value ? 'true' : 'false';
  } else if (_.isDate(value)) {
    info['formattedValue'] = value;
  } else if (_.isArray(value)) {
    info['formattedValue'] = '[ ' + value.length + ' fields ]';
    info['hasChildren'] = true;
  } else if (_.isObject(value)) {
    info['formattedValue'] = '{ ' + Object.keys(value).length + ' fields }';
    info['hasChildren'] = true;
  }

  this.data.info = info;

});


Template.TreeRow.helpers({
  formattedValue() {
    return this.info.formattedValue;
  },

  hasChildren() {
    return this.info.hasChildren;
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
