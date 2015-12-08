Meteor.methods({
  'console.execute'(databaseId, command) {
    const db = connectDatabase(databaseId);

    const wrapPromise = Meteor.wrapAsync((data, cb) => {
      const promise = data.promise;
      promise.then((result) => {
        log('> result', result);
        cb(null, 'Rows affected: ' + result.result.n);
      })
    });

    var evalData = null;
    (function () {
      'use strict';
      try {
        evalData = eval(command);
        log('> evalData', evalData);
        evalData = wrapPromise({promise: evalData});
      } catch (e) {
        throw new Meteor.Error('execution.error', e.message)
      }
    }());

    db.close();

    return evalData;
  }
});
