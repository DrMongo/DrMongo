Template.Documents.onCreated(function () {

  this.filterSelection = new ReactiveVar(null);
  this.filterOptions = new ReactiveVar({});

  this.collection = null;
  this.autorun(() => {
    if(FlowRouter.subsReady("connectionStructure")) {
      let collection = Collections.findOne(FlowRouter.getParam('collectionId'));
      Tracker.nonreactive(() => {
        this.collection = cm.mountCollection(FlowRouter.getParam('collectionId'));
        this.subscribe('externalCollection', collection.name);
      });
    }
  });

  this.result = () => {
    let selector = this.filterSelection.get() || {};
    let options = this.filterOptions.get() || {};

    return this.collection ? this.collection.find(selector, options) : null;
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
    let cursor = instance.result();
    if (!cursor) return false;

    return {result: instance.result()};
  }
});

Template.Documents.events({
  'click .edit-document'(e, i) {
    e.preventDefault();
  },
  'click .duplicate-document'(e, i) {
    e.preventDefault();

    let documentId =  $(e.currentTarget).attr('data-id');
    let document = i.collection.findOne(documentId);
    if (!document) return false;
    delete document._id;
    let newId = i.collection.insert(document);
    log(newId)
  },
  'dblclick .delete-document'(e, i) {
    e.preventDefault();

    let documentId =  $(e.currentTarget).attr('data-id');
    i.collection.remove(documentId);
  }
});
