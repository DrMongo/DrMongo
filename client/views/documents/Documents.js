Template.Documents.onCreated(function () {

  this.filterSelection = new ReactiveVar(null);
  this.filterOptions = new ReactiveVar({limit: 2});

  let externalCollection = null;
  this.autorun(() => {
    if(FlowRouter.subsReady("connectionStructure")) {
      let collection = Collections.findOne(FlowRouter.getParam('collectionId'));
      Tracker.nonreactive(() => {
        externalCollection = cm.mountCollection(FlowRouter.getParam('collectionId'));
        this.subscribe('externalCollection', collection.name);
      });
    }
  });

  this.result = () => {
    let selector = this.filterSelection.get() || {};
    let options = this.filterOptions.get() || {};
    //log('> after', selector, typeof selector);
    //log('> after', options, typeof options);
    //log(externalCollection ? externalCollection.find(selector, options) : null)
    return externalCollection ? externalCollection.find(selector, options) : null;
  }
});


Template.Documents.helpers({
  filterData() {
    let instance = Template.instance();
    return {
      onSubmit: (selection, options) => {
        instance.filterSelection.set(selection);
        instance.filterOptions.set(options);
      }
    }
  },

  result() {
    if (!Template.instance().subscriptionsReady()) return false;
    let instance = Template.instance();
    let cursor = instance.result()
    if (!cursor) return false;
    //log('> count', instance.result().count());
    return {result: instance.result()};
  }
});
