log = console.log.bind(console);

getId = (id) => {
  if(typeof id == 'object') {
    return id._id;
  }

  return id;
};

stringifyMongoId = function(id) {
  if(typeof id == 'object') {
    if(_.has(id, '_str')) {
      return id._str;
    } else {
      return id.toString()
    }
  }

  return id;
};

jsonifyMongoId = function(id) {
  if(typeof id == 'object') {
    return {_str: stringifyMongoId(id)};
  }

  return id;
};

objectifyMongoId = function(id) {
  return objectId(id) || id;
};

objectId = function(id) {
  try {
    id = getId(id);
    return new MongoInternals.NpmModule.ObjectID(id);
  } catch (e) {
    return null;
  }
};


resemblesId = function (s) {
  if (_.isString(s)) {
    return /^([0-9a-z]{24}|[0-9a-zA-Z]{15,20})$/.test(s);
  }

  return false;
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
};

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

processFilter = function(filter) {
  let reservedWords = {
    today: '{$gte: new Date("' + moment().startOf('day').toISOString() + '")}',
    yesterday: '{$gte: new Date("' + moment().subtract(1, 'day').startOf('day').toISOString() + '")}',
    thisWeek: '{$gte: new Date("' + moment().startOf('week').toISOString() + '")}',
    lastWeek: '{$gte: new Date("' + moment().subtract(1, 'week').startOf('week').toISOString() + '"), $lt: new Date("' + moment().startOf('week').toISOString() + '")}',
    thisMonth: '{$gte: new Date("' + moment().startOf('month').toISOString() + '")}',
    lastMonth: '{$gte: new Date("' + moment().subtract(1, 'month').startOf('month').toISOString() + '"), $lt: new Date("' + moment().startOf('month').toISOString() + '")}',
    thisYear: '{$gte: new Date("' + moment().startOf('year').toISOString() + '")}',
    lastYear: '{$gte: new Date("' + moment().subtract(1, 'year').startOf('year').toISOString() + '"), $lt: new Date("' + moment().startOf('year').toISOString() + '")}',
  }

  for (var i in reservedWords) {
    if (filter.indexOf('#'+i) > -1) {
      filter = filter.replace(new RegExp('#'+i, 'g'), reservedWords[i])
    }
  }

  // last30days, last2years
  let periods = ['minutes', 'hours', 'days', 'weeks', 'months', 'years'];
  var matches = filter.match(new RegExp('(\#last)([0-9]{1,3})(' + periods.join('|') + ')'));
  if (matches) {
      filter = filter.replace(matches[0], '{$gte: new Date("' + moment().subtract(parseInt(matches[2]), matches[3]).toISOString() + '")}',)
  }

  // any date #2017-10-03
  var matches = filter.match(new RegExp('(\#)([0-9]{4}\-[0-9]{2}\-[0-9]{2})'));
  if (matches) {
      filter = filter.replace(matches[0], '{$gte: new Date("' + moment(matches[2], 'YYYY-MM-DD').startOf('day').toISOString() + '"), $lte: new Date("' + moment(matches[2], 'YYYY-MM-DD').endOf('day').toISOString() + '")}',)
  }
  
  return filter;
}

processJson = function(json) {
  // replace mistakes  {"$date": #2017-10-03}
  // var matches = json.match(new RegExp('\{\s*\"\$date\"\:\s*\#[0-9]{4}\-[0-9]{2}\-[0-9]{2}\s*\}', 'g'));
  // log(matches)
  // if (matches) {
  //     return false;
  // }

  // any date #2017-10-03
  var matches = json.match(new RegExp('\#[0-9]{4}\-[0-9]{2}\-[0-9]{2}', 'g'));
  log(matches)
  if (matches) {
      _.each(matches, function(match) {
        json = json.replace(match, '{"$date": ' + moment(match.replace('#', ''), 'YYYY-MM-DD').valueOf() + '}',)
      })
  }
  return json;
}
