DocumentsPage = React.createClass({

  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {};
  },

  getMeteorData() {
    const data = {
      filterReady: false,
      filter: null
    };

    const filterId = this.props.filter;
    if(filterId) {
      const handle = Meteor.subscribe('filterHistory', filterId);
      if(handle.ready()) {
        const filter = FilterHistory.findOne(filterId);
        data.filter = filter.filter || null;
        data.filterReady = true;
      }
    } else {
      data.filter = null;
      data.filterReady = true;
    }

    return data;
  },

  render() {
    const env = this.props.currentEnvironment;
    const collection = env.collection;

    let savedFilters = FilterHistory.find({name: {$ne: null}, collection_id: collection._id}).fetch();

    return <div>
      <div className="db-theme">
        <div className="container">
          <div className="pull-right">
            <span className="dropdown" title="Saved views">
              <button type="button" className="theme-color btn btn-inverted btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="fa fa-star" /> <span className="caret" />
              </button>
              <ul className="dropdown-menu pull-right" id="saved-filters">
                <li><a href="#" id="save-filter" onClick={this.handleSaveFilter}>Save current view</a></li>
                <li role="separator" className="divider" />
                {savedFilters.map((item) => {
                  return <li><a href={RouterUtils.pathForDocuments(collection, item._id)}>{item.name}</a></li>
                })}
              </ul>
            </span>
            <button className="theme-color btn btn-sm btn-inverted pull-right" title="Clear filter" onClick={this.handleReset}>
              <i className="fa fa-ban" />
            </button>
            <button className="theme-color btn btn-sm btn-inverted pull-right" title="Reload documents" onClick={this.handleReload}>
              <i className="fa fa-refresh" />
            </button>
          </div>

          <h1 className="m-b pull-left">
            {collection.name}
          </h1>

          <div className="pull-left m-t-sm m-l">
            <InsertDocument.Modal className="nnn" title="Insert Document" icon="fa fa-plus" collection={collection}/>
            <CollectionSettings.Modal className="theme-color btn btn-inverted btn-sm" title="Collection Settings" icon="fa fa-cog" collection={collection}/>
          </div>


          {this.data.filterReady
            ? <DocumentsFilter collection={collection}
                               filter={this.data.filter}/>
            : <Loading />
          }
        </div>
      </div>

      {this.data.filterReady
        ? <DocumentsResult collection={collection}
                           filter={this.data.filter}
                           page={this.props.page}
                           seed={this.state.seed}
                           onPageChange={this.handlePageChange} />
        : <Loading />}

    </div>
  },

  handlePageChange(page) {
    RouterUtils.setQueryParams({page: page});
  },

  handleReload(event) {
    this.setState({seed: Random.id()});
  },

  handleReset(event) {
    var t = FlowRouter.current().params;
    t.filter = null;
    RouterUtils.setParams(t);
  },

  handleSaveFilter(event) {
    event.preventDefault();

    let filterId = FlowRouter.getParam('filter');
    if (filterId) {
      let name = prompt('Give filter a name to save it:');
      FilterHistory.update(filterId, {$set: {name: name}});
    } else {
      sAlert.info('No filter set.')
    }
  },

});


DocumentsFilter = React.createClass({
  getInitialState: function() {
    return {filter: this.props.filter};
  },

  componentWillReceiveProps(nextProps) {
    this.setState({filter: nextProps.filter});
  },

  render() {
    const collection = this.props.collection;
    return <div>
      <Formsy.Form className="documents-filter db-theme-form" onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col-xs-12">
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-addon">{collection.name}.find(</div>
                <MyInput className="form-control" name="filter" value={this.state.filter} type="text" autoComplete="off" />
                <div className="input-group-addon">);</div>
              </div>
            </div>
          </div>
        </div>
        <input className="hidden" type="submit" value="submit" />
      </Formsy.Form>
    </div>
  },

  handleSubmit(values) {
    const collection = this.props.collection;
    const filterId = FilterHistory.insert({
      createdAt: new Date(),
      collection_id: collection._id,
      name: null,
      filter: values.filter
    });

    RouterUtils.redirect(RouterUtils.pathForDocuments(collection, filterId))
  }

});

DocumentsResult = React.createClass({

  getInitialState() {
    return {
      documentsReady: false,
      documents: null,
      totalCount: null
    }
  },

  componentWillMount() {
    this.fetchNewDocuments(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.fetchNewDocuments(nextProps);
  },

  fetchNewDocuments(nextProps) {
    this.setState({
      documents: null
    })

    const page = nextProps.page;
    const collection = nextProps.collection;

    Meteor.call('getDocuments', collection._id, nextProps.filter, page, (error, result) => {
      if (error || result == false || typeof result == 'undefined') {
        sAlert.error('Connection failed or filter incorrect...');
        return false;
      }

      const formattedRows = [];
      result.docs.map(row => {
        let key = row._id;
        let info = TreeViewUtils.getRowInfo(typeof key == 'string' ? key : key._str, row, 0, '');
        formattedRows.push(info);
      });

      this.setState({
        documents: formattedRows,
        totalCount: result.count
      })
    });
  },

  render() {

    return <div>
      <div className="container">
        <div className="bg-box m-t-sm">
          <TreeView collection={this.props.collection}
                    documents={this.state.documents}
                    totalCount={this.state.totalCount}
                    currentPage={this.props.page}
                    onPageChange={this.props.onPageChange} />
        </div>
      </div>
    </div>
  }
});


