TreeViewUtils = {};

TreeViewUtils.getRowInfo = (key, value, level, fullPath, collection) => {
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
    childrenFields: [],
    fieldClass: type,
    isId: false,
    idValue: null,
    fullPath: fullPath,
    colspan: 2
  };

  if (resemblesId(value) || key == '_id') {
    let idString = stringifyMongoId(value);

    info['formattedValue'] = typeof value == 'object' ? `ObjectId('${idString}')` : idString;
    info['fieldClass'] = 'id';
    info['idValue'] = idString;
    info['labelText'] = 'ID';
    info['isId'] = true;
  } else if (_.isNumber(value)) {
    info['formattedValue'] = value;
    info['fieldClass'] = 'number';
    info['labelText'] = '#';
  } else if (_.isString(value)) {
    if (value == "") {
      info['formattedValue'] = '" "';
    } else {
      info['formattedValue'] = s(value).prune(35).value();
    }
    info['isPruned'] = value.length > 35;
    info['notPrunedString'] = value;
    info['labelText'] = '\" \"';
  } else if (_.isNull(value)) {
    info['formattedValue'] = 'null';
    info['fieldClass'] = 'null';
    info['labelText'] = '\\0';
  } else if (_.isBoolean(value)) {
    info['formattedValue'] = value ? 'true' : 'false';
    info['labelText'] = 'TF';
  } else if (_.isDate(value)) {
    info['formattedValue'] = moment(value).format(DRM.dateFormat);
    info['fieldClass'] = 'date';
    info['labelText'] = <i className="fa fa-calendar" />;
    info['copyValue'] = info['formattedValue']
  } else if (_.isArray(value)) {
    info['formattedValue'] = '[ ' + value.length + ' items ]';
    info['fieldClass'] = 'array';
    info['hasChildren'] = true;
    info['labelText'] = '[ ]';
  } else if (_.isObject(value)) {
    info['formattedValue'] = '{ ' + Object.keys(value).length + ' fields }';
    info['fieldClass'] = 'object';
    info['hasChildren'] = true;
    info['labelText'] = '{ }';
  }

  if (!info['hasChildren']) {
    info['isPinned'] = _.contains(collection.pinnedColumns, fullPath)
  }

  info.fieldClass = 'field-' + info.fieldClass;

  if (level == 0) {
    let pinnedColumns = [];
    if (collection.pinnedColumnsFormatted && collection.pinnedColumnsFormatted.length > 0) {
      _.each(collection.pinnedColumnsFormatted, (column) => {
        try {
          // todo remove eval
          let t = eval('(value["' + column + '"])');
          if(typeof t == 'undefined') t = '';
          pinnedColumns.push(`${t}`); // ensure string format
        } catch (error) {
          pinnedColumns.push('');
        }
      })
    } else {
      pinnedColumns.push(value.name);
      pinnedColumns.push(value.title);
    }
    if (pinnedColumns.length) {
      info.pinnedColumns = pinnedColumns;
      info.colspan += pinnedColumns.length;
    }

    info.drMongoIndex = value.drMongoIndex;
    delete value.drMongoIndex;
  }

  return info;
};

TreeViewUtils.getChildren = (info, collection) => {
  if (!info.hasChildren) return null;
  const value = info.value;

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

  let children = [];
  _.each(fields, (v) => {
    children.push(TreeViewUtils.getRowInfo(v.key, v.value, info.level + 1, info.fullPath + '.' + v.key, collection));
  });

  return children;
};
