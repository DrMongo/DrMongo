let hintTimeout = {};
let showHint = (namespace, message = true) => {
  // stop previous timeout if exists
  if(hintTimeout[namespace]) Meteor.clearTimeout(hintTimeout[namespace]);

  if(message) {
    hintTimeout[namespace] = Meteor.setTimeout(() => {
      sAlert.info(message);
    }, 300);
  }
};

TreeView = React.createClass({


  getInitialState() {
    return {
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
    });

    const page = nextProps.currentPage;
    const collection = nextProps.env.collection;

    Meteor.call('getDocuments', collection._id, nextProps.filter, page, (error, result) => {
      if (error || result == false || typeof result == 'undefined') {
        sAlert.error('Connection failed or filter incorrect...');
        return false;
      }

      const formattedRows = [];

      result.docs.map(row => {
        let info = TreeViewUtils.getRowInfo(getId(row._id), row, 0, '', collection);
        formattedRows.push(info);
      });

      this.setState({
        documents: formattedRows,
        totalCount: result.count
      })
    });
  },

  componentDidMount() {
    if (this.props.openFirstDocument == true) {
      Meteor.setTimeout(function() {
        $('table.tree-view tbody tr:eq(0)').trigger('click');
      }, 100);
    }
  },

  render() {
    const collection = this.props.env.collection;
    const documents = this.state.documents;

    const pinnedColumns = collection.pinnedColumnsFormatted || [];
    if (!pinnedColumns.length) {
      pinnedColumns.push(''); // for .name
      pinnedColumns.push(''); // for .title
    }

    let results;
    if (documents == null) {
      results = <tbody><tr><td colSpan="4"><Loading /></td></tr></tbody>;
    } else if (documents.length == 0) {
      return <h2 className="text-center p-t-md p-b-md">No results.</h2>;
    } else {
      results = documents.map(item => {
        return <TreeView.Document key={item.keyValue} document={item} env={this.props.env} refreshDocuments={this.handleRefreshDocuments} />
      });
    }

    return <table className="table tree-view">
      <thead>
      <tr className="column-headers">
        <td className="cell key">
          #. _id
          <div className="btn btn-soft btn-xs" onClick={this.handleToggleIdLength}>
            {collection.showFullId ? <i className="fa fa-toggle-off" /> : <i className="fa fa-toggle-on" />}
          </div>
        </td>
        {pinnedColumns.map((item, index) => (<td className="cell pinned" key={index}>{item}</td>))}
        <td>
          <div className="pull-right">
            <small className="m-r-sm">{this.state.totalCount} items</small>
            <TreeView.Pagination pageLimit={this.props.paginationLimit}
                                 totalCount={this.state.totalCount}
                                 currentPage={this.props.currentPage}
                                 onPageChange={this.props.onPageChange} />
          </div>
        </td>
      </tr>
      </thead>
      {results}
    </table>
  },

  handleRefreshDocuments() {
    this.fetchNewDocuments(this.props);
  },

  handleToggleIdLength(event) {
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();
    const collection = this.props.env.collection;
    const current = !!collection.showFullId;
    Collections.update(collection._id, {$set: {showFullId: !current}});
  }

});


TreeView.Document = React.createClass({

  getInitialState() {
    return {
      opened: false,
      openChildren: false
    }
  },

  render() {
    const document = this.props.document;
    const collection = this.props.env.collection;

    const rowClass = 'parent document' + (document.hasChildren ? ' toggle-children' : '');
    const children = TreeViewUtils.getChildren(document, this.props.env.collection);

    let pinnedColumns;
    if (document.pinnedColumns) {
      pinnedColumns = document.pinnedColumns.map((item, index) => (<td className="cell pinned" key={index}>{item}</td>));
    }

    const editProps = {
      document: document,
      collection: this.props.env.collection,
      onSave: this.props.refreshDocuments
    };

    let childrenElement;
    if(this.state.opened) {
      childrenElement = <tr className="children">
        <td colSpan={document.colspan}>
          {children.map(item => (
            <TreeView.DocumentRow key={item.keyValue} info={item} env={this.props.env} open={this.state.openChildren} />
          ))}
        </td>
      </tr>;
    }

    let keyValue = document.keyValue;
    if(!collection.showFullId) {
      keyValue = '...' + keyValue.substr(keyValue.length - 5, 5);
    }
    let keyClass = classNames('cell key', {
      shorten: !collection.showFullId
    });


    return <tbody>
      <tr className={rowClass} onClick={this.handleToggleOpen}>
        <td className={keyClass}>
          <span className="drm-index">{document.drMongoIndex}.</span> {keyValue} <small>{document.formattedValue}</small>
        </td>
        {pinnedColumns}
        <td className="cell actions text-right">
          <EditDocument.Modal className="btn btn-primary btn-soft btn-xs" icon="fa fa-pencil" editProps={editProps} />
          <InsertDocument.Modal className="btn btn-warning btn-soft btn-xs" title="Duplicate document" icon="fa fa-files-o" collection={this.props.env.collection} value={document.value}/>

          <button className="btn btn-danger btn-soft btn-xs" title="Remove document"
             onClick={this.handleDeleteDocumentClick}
             onDoubleClick={this.handleDeleteDocumentDoubleClick}>
            <i className="fa fa-trash" />
          </button>
        </td>
      </tr>
      {childrenElement}
    </tbody>
  },

  handleToggleOpen(event) {
    event.preventDefault();

    const newState = {opened: !this.state.opened};
    if(event.metaKey) {
      newState.openChildren = !this.state.opened;
    }
    this.setState(newState);
  },

  handleDeleteDocumentClick(event) {
    event.stopPropagation();

    showHint('delete', 'Psst!! Hey you! Try double click...');
  },

  handleDeleteDocumentDoubleClick(event) {
    event.stopPropagation();

    showHint('delete', false);
    Meteor.call('removeDocument', this.props.env.collectionId, this.props.document.value._id, (error, result) => {
      if(error) {
        log(error);
      } else {
        log('Document deleted!', result);
        sAlert.success('Document deleted');
        this.props.refreshDocuments();
      }
    })
  }

});


TreeView.DocumentRow = React.createClass({

  getInitialState() {
    return {
      opened: this.props.open || false
    }
  },


  render() {
    const info = this.props.info;

    const parentRowClass = classNames({
      'row head': true,
      'toggle-children': info.hasChildren
    }, info.fieldClass);

    const children = TreeViewUtils.getChildren(info, this.props.env.collection);

    let pinButton;
    if(!info.hasChildren && !info.isId) {
      pinButton = <div className="btn btn-primary btn-soft btn-xs control-icon pin-column" data-full-path={info.fullPath} onClick={this.handlePin}>
        {info.isPinned ? <i className="fa fa-thumb-tack text-danger" /> : <i className="fa fa-thumb-tack" />}
      </div>;
    }

    let formattedValue;
    if(info.isId) {
      formattedValue = <a href="#" onClick={this.handleFindById}>{info.formattedValue}</a>
    } else {
      formattedValue = info.formattedValue;
    }

    const parentClass = classNames('parent col-xs-12', {collapsed: this.state.opened});

    return <div className={parentClass}>
      <div className={parentRowClass} onClick={this.handleToggleChildren}>
        <div className="col-xs-4 cell key">
          {info.drMongoIndex} <span className="value-type-label">{info.labelText}</span> {info.keyValue} {pinButton}
          <div className="btn btn-primary btn-soft btn-xs copy-value control-icon pull-right" onClick={this.handleCopyValue}>
            <i className="fa fa-clipboard" />
          </div>
        </div>
        <div className="col-xs-8 cell value">
          {formattedValue}&nbsp;
          {info.isPruned ? <ViewDocument.Modal text={info.notPrunedString} className="view-value"/> : null}
        </div>
      </div>
      {children && this.state.opened ? this.renderRowChildren(children) : null}
    </div>
  },

  renderRowChildren(children) {
    return <div className="row children">
      {children.map(item => (
        <TreeView.DocumentRow key={item.keyValue} info={item} env={this.props.env} open={this.props.open} />
      ))}
    </div>
  },

  handleToggleChildren(event) {
    if ($(event.target).parent().is('.control-icon')) return true;

    event.preventDefault();
    this.setState({opened: !this.state.opened});
  },

  handleCopyValue(event) {
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();

    let copyValue = this.props.info.copyValue || EJSON.stringify(this.props.info.value)
    copyText(copyValue);
  },

  handlePin(event) {
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();

    const path = event.currentTarget.dataset['fullPath'];
    let pathFormatted = path.replace(/^\./, '');
    pathFormatted = pathFormatted.replace(/\.([0-9]+)$/g, '[$1]');
    pathFormatted = pathFormatted.replace(/\.([0-9]+)\./g, '[$1].');

    const collectionId = this.props.env.collectionId;
    var c = Collections.findOne(collectionId);
    if (c && c.pinnedColumns && _.indexOf(c.pinnedColumns, path) >= 0) {
      Collections.update(collectionId, {$pull: {pinnedColumns: path, pinnedColumnsFormatted: pathFormatted}});
    } else {
      Collections.update(collectionId, {$addToSet: {pinnedColumns: path, pinnedColumnsFormatted: pathFormatted}});
    }

  },

  handleFindById(event) {
    event.preventDefault();

    const databaseId = this.props.env.databaseId;
    const id = this.props.info.value;

    Meteor.call('findCollectionForDocumentId', databaseId, id, (error, result) => {
      if(error) {
        log(error);
        return;
      }

      if (result === null) {
        sAlert.warning('Document not found.');
      }

      let c = Collections.findOne({database_id: databaseId, name: result});
      if (c) {
        let filterId = FilterHistory.insert({
          createdAt: new Date(),
          collection_id: c._id,
          name: null,
          filter: getId(id)
        });

        RouterUtils.redirect(RouterUtils.pathForDocuments(c, filterId))
      }
    });


  }

});

TreeView.Pagination = React.createClass({

  render() {
    const totalCount = parseInt(this.props.totalCount);
    const currentPage = parseInt(this.props.currentPage);
    const pagesCount = Math.ceil(totalCount / parseInt(this.props.pageLimit));

    if(pagesCount == 1) return <div></div>;

    const previousPage = currentPage == 1 ? currentPage : currentPage - 1;
    const nextPage = currentPage == pagesCount ? currentPage : currentPage + 1;

    let count = 4;
    let quotient = (pagesCount - 1) / count;

    let pages = _.range(_.max([1, currentPage - 3]), _.min([pagesCount, currentPage + 3]));
    for (let i = 0; i <= count; i++) {
      pages.push(Math.round(quotient * i) + 1);
    }

    pages = Array.from(new Set(pages));
    pages.sort((a,b) => a-b);

    classForButton = (disabled) => {
      return classNames({'disabled': disabled});
    };

    classForPage = (disabled) => {
      return classNames({'disabled': disabled});
    };

    return <div className="pagination-wrapper">
      <ul className="pagination">
        <li key="first" className={classForButton(currentPage == 1)}><a onClick={this.handlePageChange.bind(this, 1)} ><i className="fa fa-angle-double-left" /></a></li>
        <li key="prev" className={classForButton(currentPage == 1)}><a onClick={this.handlePageChange.bind(this, previousPage)} ><i className="fa fa-angle-left" /></a></li>
        {pages.map(page => {
          return <li key={page} className={classForPage(currentPage == page)}><a href="#" onClick={this.handlePageChange.bind(this, page)}>{page}</a></li>
        })}
        <li key="next" className={classForButton(currentPage == pagesCount)}><a onClick={this.handlePageChange.bind(this, nextPage)} ><i className="fa fa-angle-right" /></a></li>
        <li key="last" className={classForButton(currentPage == pagesCount)}><a onClick={this.handlePageChange.bind(this, pagesCount)}><i className="fa fa-angle-double-right" /></a></li>
      </ul>
    </div>
  },

  handlePageChange(page, event) {
    event.preventDefault();
    event.currentTarget.blur();
    this.props.onPageChange(page);
  }

});
