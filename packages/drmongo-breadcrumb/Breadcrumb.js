Breadcrumb = class Breadcrumb {
  constructor() {
    this._path = new ReactiveVar([]);
  }

  _setPath(path) {
    let defaultPath = _.filter(this._path.get(), v => !!v.default);
    path = defaultPath.concat(path);
    _.each(path, v => v.last = false );
    if(path.length) {
      path[path.length -1]['last'] = true;
    }
    this._path.set(path);
  }

  defaultPath(path) {
    _.each(path, v => v.default = true);
    this._setPath(path);
  }

  path(path) {
    this._setPath(path);
  }

  getPath() {
    return this._path;
  }
};

breadcrumb = new Breadcrumb;
