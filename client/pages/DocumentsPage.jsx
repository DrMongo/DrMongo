DocumentsPage = React.createClass({

  mixins: [ReactMeteorData],

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
      data.filterReady = true;
    }

    return data;
  },

  render() {
    const env = this.props.currentEnvironment;

    const collection = env.collection;

    return <div>
      <div className="db-theme">
        <div className="container">
          <div className="pull-right">
            <span className="dropdown" title="Saved views">
              <button type="button" className="theme-color btn btn-inverted btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="fa fa-star" /> <span className="caret" />
              </button>
              <ul className="dropdown-menu pull-right" id="saved-filters">
                <li><a href="#" id="save-filter">Save current view @TODO</a></li>
                <li role="separator" className="divider" />
                <li><a href="#">@TODO</a></li>
              </ul>
            </span>
            <button className="theme-color btn btn-sm btn-inverted pull-right" disabled title="Clear filter">
              <i className="fa fa-ban" />
            </button>
            <button className="theme-color btn btn-sm btn-inverted pull-right" disabled title="Reload documents">
              <i className="fa fa-refresh" />
            </button>
          </div>

          <h1 className="m-b pull-left">
            {collection.name}
          </h1>

          <div className="pull-left m-t-sm m-l">
            <button className="theme-color btn btn-inverted btn-sm" disabled title="Insert new document">
              <i className="fa fa-plus" />
            </button>
            <button className="theme-color btn btn-sm btn-inverted pull-right" disabled title="Collection dashboard">
              <i className="fa fa-cog" />
            </button>
          </div>

          <DocumnetsFilter collection={collection} />
        </div>
      </div>

      {this.data.filterReady ? <DocumentsResult collection={collection} filter={this.data.filter} page={this.props.page} /> : <Loading />}

    </div>
  }

});


DocumnetsFilter = React.createClass({

  render() {
    const collection = this.props.collection;

    return <div>
      <Formsy.Form className="documents-filter db-theme-form" onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col-xs-12">
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-addon">{collection.name}.find(</div>
                <MyInput className="form-control" name="filter" value="{}" type="text" autoComplete="off" />
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
    this.fetchNewDocuments();
  },

  componentWillReceiveProps() {
    this.fetchNewDocuments();
  },

  fetchNewDocuments() {
    log('> fetchNewDocuments');
    const page = this.props.page;
    const collection = this.props.collection;

    Meteor.call('getDocuments', collection.database_id, collection.name, this.props.filter, page, (error, result) => {
      if (error || result == false || typeof result == 'undefined') {
        alert('Connection failed or filter incorrect...');
        return false;
      }

      const formattedRows = [];
      result.docs.map(row => {
        let key = row._id;
        let info = TreeViewUtils.getRowInfo(typeof key == 'string' ? key : key._str, row, 0, '');
        formattedRows.push(info);
      });

      this.setState({
        documentsReady: true,
        documents: formattedRows,
        totalCount: result.count
      })
    });
  },

  render() {
    const totalCount = this.state.totalCount;
    const collection = this.props.collection;
    const page = this.props.page;
    const pageLimit = collection.paginationLimit;

    return <div>
      <div className="text-center m-t-sm">
        {totalCount ? <DocumentsPagination totalCount={totalCount} pageLimit={pageLimit} currentPage={page} sizeClass="btn-group-xs" /> : null}
      </div>

      <div className="container">
        <div className="bg-box m-t-sm">
          {this.state.documentsReady
            ? <TreeView documents={this.state.documents} />
            : <Loading />
          }
        </div>
      </div>

      <div className="text-center m-t">
        {totalCount ? <DocumentsPagination totalCount={totalCount} pageLimit={pageLimit} currentPage={page} /> : null}
      </div>
    </div>
  }
});

DocumentsPagination = React.createClass({

  getDefaultProps() {
    return {
      pageLimit: 20,
      currentPage: 1
    }
  },

  render() {

    const totalCount = this.props.totalCount;
    const currentPage = this.props.currentPage;
    const pagesCount = Math.ceil(totalCount / this.props.pageLimit);
    const groupClass = classNames('btn-group', this.props.sizeClass || null);

    const pages = [];
    for (var i = 0; i < 5; i++) {
      var index = currentPage - i;
      if(index <= 0) break;
      pages.push({
        index: index,
        label: index + ' page'
      });
    }

    pages.push({
      index: currentPage,
      label: currentPage + 'page'
    });

    for (var i = 0; i < 5; i++) {
      var index = currentPage + i;
      if(index > pagesCount) break;
      pages.push({
        index: index,
        label: index + ' page'
      });
    }

    log(pages);

    return <div className={groupClass}>
      <button className="btn btn-default" onClick={this.handlePageChange} ><i className="fa fa-angle-double-left" /></button>
      <button className="btn btn-default"><i className="fa fa-angle-left" /></button>
      {pages.map(item => {
        return <button key={item.index} className="btn btn-default">{item.index}</button>
      })}
      <button className="btn btn-default"><i className="fa fa-angle-right" /></button>
      <button className="btn btn-default"><i className="fa fa-angle-double-right" /></button>
    </div>
  },

  handlePageChange(event) {
    event.preventDefault();
  }

});
