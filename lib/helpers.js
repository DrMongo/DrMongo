log = console.log.bind(console);

// ------------------------------ Router ------------------------------ //

goTo = (url, parameters) => {
  FlowRouter.go(url, parameters);
};

redirect = (path) => {
  FlowRouter.redirect(path);
};

pathTo = function (name, parameters) {
  return FlowRouter.path(name, parameters);
};


currentUrl = function () {
  var currentRoute = FlowRouter.current();
  var routeName = currentRoute.route.name;
  // FlowRouter.path() returns a path starting with a '/' but Meteor.absoluteUrl()
  // doesn't want it - that's why we've got the substr(1)
  return Meteor.absoluteUrl(FlowRouter.path(routeName, currentRoute.params).substr(1));
};

absoluteUrl = (route, parameters) => {
  if (Meteor.isServer) {
    path = pathTo(route, parameters);
    if (path.substring(0, 1) == '/') {
      path = path.substring(1);
    }
    return Meteor.absoluteUrl(path);
  } else {
    log('> absoluteUrl() not working on client');
    return '';
  }
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
