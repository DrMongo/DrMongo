Icons = {
  forCollection(name) {
    let mapper = {
      articles: 'fa fa-newspaper-o'
    };

    let match = _.find(mapper, (value, key) => {
      return key == name.toLowerCase();
    });

    const singular = _.singularize(name);
    if(!match && faIconsList.indexOf(name) != -1) {
      match = faIconsList[faIconsList.indexOf(name)];
    } else if (!match && faIconsList.indexOf(singular) != -1) {
      match = faIconsList[faIconsList.indexOf(singular)];
    }

    return match ? 'fa fa-' + match : 'fa fa-list';
  }
};
