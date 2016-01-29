log = console.log.bind(console);


// ------------------------------ Router ------------------------------ //
stringifyMongoId = function(id) {
  if(typeof id == 'object') {
    if(id.id) return id.id;
    else return id._str;
  }

  return id;
};


// http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
checkNested = function (obj /*, level1, level2, ... levelN*/) {
  var args = Array.prototype.slice.call(arguments),
    obj = args.shift();

  for (var i = 0; i < args.length; i++) {
    if (!obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
};


getColumn = function (array, columnName) {
  var column = [];
  for (var x in array)
    column.push(array[x][columnName]);

  return column
};

// http://stackoverflow.com/questions/5484673/javascript-how-to-dynamically-create-nested-objects-using-object-names-given-by
assignToObject = function (obj, keyPath, value) {
  var lastKeyIndex = keyPath.length - 1, key;
  for (var i = 0; i < lastKeyIndex; ++i) {
    key = keyPath[i];
    if (!(key in obj))
      obj[key] = {};
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
};

//http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
isObjectEmpty = function (obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }

  return true;
};

deepClone = function (object) {
  if (!object) return {};
  return JSON.parse(JSON.stringify(object));
}

resemblesId = function (s) {
  if (!_.isString(s)) return false;
  let pattern = new RegExp('^[0-9a-zA-Z]{17}$');
  return pattern.exec(s) !== null;
}

copyText = function(text) {
  if ($('#fakeTextarea').length == 0) {
    let fakeTextarea = document.createElement('textarea');
    fakeTextarea.style.position = 'absolute';
    fakeTextarea.style.left = '-9999px';
    fakeTextarea.style.top = (window.pageYOffset || document.documentElement.scrollTop) + 'px';
    fakeTextarea.setAttribute('readonly', '');
    fakeTextarea.setAttribute('id', 'fakeTextarea');

    document.body.appendChild(fakeTextarea);
  }

  if (text.indexOf('"') === 0) {
    text = text.substring(1, text.length - 1);
  }

  $('#fakeTextarea').val(text).select();

  let succeeded;

  try {
    succeeded = document.execCommand('copy');
  }
  catch (err) {
    succeeded = false;
  }

  sAlert.success(succeeded ? 'Copied to clipboard.' : 'Press CTRL/CMD + C.');
}

getFilterRoute = function(filterId, pagination) {
  pagination = parseInt(pagination) || 0;
  let t = FlowRouter.current();
  if (filterId === null) filterId = t.params.filter;
  if (pagination < 1) pagination = null;
  if (pagination !== null && !filterId) filterId = '-';
  if (pagination === null && filterId == '-') filterId = null;

  FlowRouter.go(
    '/' + t.params.connection + '/' + t.params.database + '/' + t.params.collection
    + (filterId ? ('/' + filterId) : '')
    + (pagination ? ('/' + pagination) : '')
  );
}
