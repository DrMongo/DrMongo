Icons = {
  forCollection(name) {
    let mapper = {
      articles: 'newspaper'
    };

    let match = _.find(mapper, (value, key) => {
      return key == name;
    });

    return match ? match : (_.singularize(name) + ' ' + name);
  }
};
