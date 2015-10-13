Template.Documents.onCreated(function () {

  this.filterSelection = new ReactiveVar(null);
  this.filterOptions = new ReactiveVar({limit: 2});

  let externalCollection = null;
  this.autorun(() => {
    if(FlowRouter.subsReady("connectionStructure")) {
      let collectionName = FlowRouter.getParam('collectionId');

      Tracker.nonreactive(() => {
        let collection = Collections.findOne(collectionName);
        externalCollection = cm.mountCollection(collection.name);
        this.subscribe('externalCollection', collection);
      });


    }
  });

  this.result = () => {
    let selection = this.filterSelection.get();
    let options = this.filterOptions.get();
    log('> after', selection, typeof selection);
    log('> after', options, typeof options);
    return externalCollection ? externalCollection.find(selection, options) : null;
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
    let instance = Template.instance();
    log('> count', instance.result().count());
    return {result: instance.result()};
  }
});
