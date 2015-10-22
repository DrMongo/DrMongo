Icons = {
  forCollection(name) {
    let mapper = {
      invoice: 'fa fa-usd',
      invoices: 'fa fa-usd',
      price: 'fa fa-usd',
      prices: 'fa fa-usd',

      rental: 'fa fa-home',
      house: 'fa fa-home',

      category: 'fa fa-folder-o',
      categories: 'fa fa-folder-o',

      location: 'fa fa-map-marker',
      locations: 'fa fa-map-marker',

      region: 'fa fa-map-o',
      product: 'fa fa-cube',
      articles: 'fa fa-newspaper-o',
      customer: 'fa fa-smile-o',
      employee: 'fa fa-male',
      shippers: 'fa fa-ship',
      order: 'fa fa-shopping-cart'
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
