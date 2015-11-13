class Shortcuts {

  constructor() {
    this._list = {};
  }

  register(namespace, bindTo, keys, label, action) {
    Mousetrap.bind(bindTo, action);

    if(!this._list[namespace]) {
      this._list[namespace] = [];
    }

    this._list[namespace].push({
      keys: keys,
      label: label
    });
  }

  get list() {
    return this._list;
  }

}

shortcuts = new Shortcuts();
