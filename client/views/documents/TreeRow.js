Template.TreeRow.helpers({
  formattedValue() {
    let value = null;
    if(this.key == '_id') {
      value = this.value;
    } else if(_.isString(this.value)) {
      value = this.value;
    } else if(_.isArray(this.value)) {
      value = '[ ' + this.value.length + ' fields ]';
    } else if(_.isObject(this.value)) {
      value = '{ ' + Object.keys(this.value).length + ' fields }';
    } else {
      value = typeof this.value;
    }

    return value;
  },

  isType(assertType) {
    let type = typeof this.value;
    if(this.key === '_id') type = 'string';
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
  }
});
