DocumentsPage = React.createClass({

  mixins: [ReactMeteorData],

  getDefaultProps() {
    return {
      page: 1
    }
  },


  getInitialState: function() {
    return {};
  },

  getMeteorData() {
    const data = {
      filterReady: false,
      filter: null
    };

    const filterId = this.props.filter;

    if(this.props.filter) {
      var filter = FilterHistory.findOne(filterId);
    } else {
      var filter = null;
    }

    if (filter) {
        data.filter = filter.filter || null;
        data.filterReady = true;
    } else {
      data.filter = '{}';
      data.filterReady = true;
    }

    const env = this.props.currentEnvironment;
    const collection = env.collection;

    data.savedFilters = FilterHistory.find({name: {$ne: null}, collection_id: collection._id}).fetch();


    return data;
  },

  render() {
    const env = this.props.currentEnvironment;
    const collection = env.collection;

    seo.setTitleByEnvironment(env, this.data.filter, this.props.page)

    let currentSettings = new CurrentSettings();

    if (collection.paginationLimit) {
      var paginationLimit = collection.paginationLimit;
    } else {
      var paginationLimit = currentSettings.global.documentsPerPage;
    }


    return <div>
      <div className="db-theme">
        <div className="container">
          <h1 className="m-b pull-left">
            {collection.name}
          </h1>

          <div className="pull-left m-t-sm m-l">
            <InsertDocument.Modal className="theme-color btn btn-inverted btn-sm" title="Insert Document" icon="fa fa-plus" collection={collection}/>
            <CollectionSettings.Modal className="theme-color btn btn-inverted btn-sm" title="Collection Settings" icon="fa fa-cog" collection={collection}/>
          </div>


          {this.data.filterReady
            ? <DocumentsFilter collection={collection}
                               savedFilters={this.data.savedFilters}
                               onRefresh={this.handleRefresh}
                               filter={this.data.filter}/>
            : <Loading />
          }
        </div>
      </div>

      {this.data.filterReady
        ? <DocumentsResult env={env}
                           filter={this.data.filter}
                           paginationLimit={paginationLimit}
                           page={this.props.page}
                           seed={this.state.seed}
                           onPageChange={this.handlePageChange} />
        : <Loading />}

    </div>
  },

  handlePageChange(page) {
    RouterUtils.setQueryParams({page: page});
  },

  handleRefresh() {
    this.setState({seed: Random.id()});
  }
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
                <div className="input-group-addon">
                  <span className="dropdown" title="Saved views">
                    <a className="theme-color btn btn-sm dropdown-toggle right-action" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i className="fa fa-star" /> <span className="caret" />
                    </a>
                    <ul className="dropdown-menu pull-right" id="saved-filters">
                      <li><a href="#" id="save-filter" onClick={this.handleSaveFilter}>Save current view</a></li>
                      <li role="separator" className="divider" />
                      {this.props.savedFilters.map((item, index) => {
                        return <li key={index}><a href={RouterUtils.pathForDocuments(collection, item._id)}>{item.name} <i className="fa fa-trash text-danger" onClick={this.handleDeleteFilter.bind(this, item._id)}></i></a></li>
                      })}
                    </ul>
                  </span>

                </div>
                <div className="input-group-addon">
                  <a className="theme-color btn btn-sm pull-right right-action" title="Clear filter" onClick={this.handleReset}>
                    <i className="fa fa-ban" />
                  </a>
                </div>
                <div className="input-group-addon">
                  <a className="theme-color btn btn-sm pull-right right-action" title="Reload documents" onClick={this.props.onRefresh}>
                    <i className="fa fa-refresh" />
                  </a>
                </div>


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

  handleDeleteFilter(filterId, event) {
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();

    FilterHistory.update(filterId, {$set: {name: null}});
  }


});

DocumentsResult = React.createClass({
  render() {
    return <div>
      <div className="container">
        <div className="bg-box m-t-sm m-b-lg">
          <TreeView env={this.props.env}
                    filter={this.props.filter}
                    currentPage={this.props.page}
                    paginationLimit={this.props.paginationLimit}
                    onPageChange={this.props.onPageChange}
                    onFindById={this.handleFindById} />
        </div>
      </div>
    </div>
  }

}) ;


