class Seo {

  constructor() {
    DocHead.setTitle('Dr. Mongo');
  }

  setTitle(title) {
    if (title) {
      DocHead.setTitle(title + ' | Dr. Mongo');
    } else {
      DocHead.setTitle('Dr. Mongo');
    }
  }

  setTitleByEnvironment(currentEnvironment, filter, pagination) {
    if (currentEnvironment.collection) {
      var title = currentEnvironment.collection.name
        + '.find('
        + filter
        + ');';

      if (pagination > 1) {
        title += ' [page ' + pagination + ']'
      }
      DocHead.setTitle(title);
    } else if (currentEnvironment.database) {
      DocHead.setTitle(currentEnvironment.database.name);
    } else if (currentEnvironment.connection) {
      DocHead.setTitle(currentEnvironment.connection.name);
    } else {
      DocHead.setTitle(null);
    }
  }

}


seo = new Seo();
