CurrentSettings = class CurrentSettings {

  constructor () {
    this.defaults = {
      openFirstDocument: true,
      documentsPerPage: 20
    };
  }

  get global() {
    let s = Settings.findOne({_id: '12345678901234567'});
    return (s && s.value) ? s.value : this.defaults;
  }

  setGlobal(name, value) {
    let s = this.global;
    s[name] = value;
    Settings.upsert({_id: '12345678901234567'}, {name: 'global', value: s});
  }
};
