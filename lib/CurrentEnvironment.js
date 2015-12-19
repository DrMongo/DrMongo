CurrentEnvironment = class CurrentEnvironment {

  constructor () {
    this.connection = null;
    this.database = null;
    this.collection = null;
  }

  get connectionId() { return !!this.connection ? this.connection._id : null }
  get databaseId  () { return !!this.database   ? this.database._id   : null }
  get collectionId() { return !!this.collection ? this.collection._id : null }

  get databaseTheme() {
    const db = this.database;
    return db && db.theme ? db.theme : 'default'
  }

};
