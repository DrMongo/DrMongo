Icons = {
  forCollection(name) {
    let mapper = {
      invoice:        'fa fa-usd',
      price:          'fa fa-usd',
      demand:         'fa fa-usd',

      rental:         'fa fa-home',
      house:          'fa fa-home',

      article:        'fa fa-font',
      blog:           'fa fa-font',

      category:       'fa fa-folder-o',
      categories:     'fa fa-folder-o',

      company:        'fa fa-building-o',
      companies:      'fa fa-building-o',

      website:        'fa fa-chrome',
      domain:         'fa fa-chrome',
      webpage:        'fa fa-chrome',

      location:       'fa fa-map-marker',
      testimonial:    'fa fa-comment',
      review:         'fa fa-star-half-o',
      travel:         'fa fa-suitcase',
      html:           'fa fa-html5',
      region:         'fa fa-map-o',
      product:        'fa fa-cube',
      articles:       'fa fa-newspaper-o',
      customer:       'fa fa-smile-o',
      employee:       'fa fa-male',
      shippers:       'fa fa-ship',
      settings:       'fa fa-cogs',
      dictionary:     'fa fa-language',
      order:          'fa fa-shopping-cart'
    };

    let match = null;
    const singular = _.singularize(name);
    const nameLowerObj = s(name).toLowerCase();
    const nameHumanizedArray = s(name).humanize().toLowerCase().value().split(' ');


    // by mapper, exact
    match = _.find(mapper, (value, key) => {
      return key == name.toLowerCase();
    });
    if(match) return match;


    // by icon name, exact
    if(faIconsList.indexOf(name) != -1) {
      match = faIconsList[faIconsList.indexOf(name)];
    } else if (faIconsList.indexOf(singular) != -1) {
      match = faIconsList[faIconsList.indexOf(singular)];
    }
    if(match) return 'fa fa-' + match;


    // by mapper, partial
    match = _.find(mapper, (value, key) => {
      return nameLowerObj.include(key);
    });
    if(match) return match;


    // by icon name, partial
    match = _.find(nameHumanizedArray, (namePart) => {
      return _.find(faIconsList, (iconName) => {
        return namePart == iconName;
      });
    });
    //log('> match', match);
    if(match) return 'fa fa-' + faIconsList[faIconsList.indexOf(match)];



    return 'fa fa-list';
  }
};
