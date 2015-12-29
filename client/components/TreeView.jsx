let deleteHintTimeout = null;
let showDeleteHint = (show = true) => {
  // first stop previous timeout if exists
  if(deleteHintTimeout) Meteor.clearTimeout(deleteHintTimeout);

  if(show) {
    deleteHintTimeout = Meteor.setTimeout(() => {
      sAlert.info('Psst!! Hey you! Try double click...');
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

  componentDidMount() {
    // @TODO auto open first row
  },

  render() {
    const collection = this.props.collection;
    const documents = this.state.documents;

    let pinnedColumns = [];
    if (collection.pinnedColumnsFormatted) {
      pinnedColumns = collection.pinnedColumnsFormatted;
    } else if (documents && documents.length > 0) {
      if (documents[0].value.name) pinnedColumns.push('name');
      if (documents[0].value.title) pinnedColumns.push('title');
    }

    let results;
    if (documents == null) {
      results = <tbody><tr><td colSpan="3"><Loading /></td></tr></tbody>;
    } else if (documents.length == 0) {
      return <h2 className="text-center p-t-md p-b-md">No results.</h2>;
    } else {
      results = documents.map(item => (<TreeView.Document key={item.keyValue} document={item} collection={collection} fetchNewData={this.handleFetchNewData} />));
    }

    return <table className="table tree-view">
      <thead>
      <tr className="column-headers">
        <td className="cell key">#. _id</td>
        {pinnedColumns.map(item => (<td className="cell pinned" key={item}>{item}</td>))}
        <td>
          <div className="pull-right">
            <span className="m-r-sm">{this.state.totalCount}x</span>
            <TreeView.Pagination pageLimit={collection.paginationLimit}
                                 totalCount={this.props.totalCount}
                                 currentPage={this.props.currentPage}
                                 onPageChange={this.props.onPageChange} />
          </div>
        </td>
      </tr>
      </thead>
      {results}
    </table>
  },

  handleFetchNewData() {
    this.fetchNewDocuments(this.props);
  }

});


TreeView.Document = React.createClass({

  render() {
    const document = this.props.document;

    const rowClass = 'parent document' + (document.hasChildren ? ' toggle-children' : '');
    const children = TreeViewUtils.getChildren(document);

    const pinnedColumns = [];
    let key = 0;

    if (document.pinnedColumns) {
      document.pinnedColumns.map(item => {
        pinnedColumns.push({key: key++, value: item});
      });
    }

    const editProps = {
      document: document,
      collection: this.props.collection,
      onSave: this.props.fetchNewData
    };

    return <tbody>
      <tr className={rowClass} onClick={this.handleToggleDocument}>
        <td className="cell key">
          <span className="drm-index">{document.drMongoIndex}.</span> {document.keyValue} <small>{document.formattedValue}</small>
        </td>
        {pinnedColumns.map(item => (<td className="cell pinned" key={item.key}>{item.value}</td>))}
        <td className="cell actions text-right" onClick={this.handleActionClick}>
          <EditDocument.Modal className="btn btn-primary btn-soft btn-xs" icon="fa fa-pencil" editProps={editProps} />
          <a className="btn btn-warning btn-soft btn-xs" href="#" title="Duplicate document"
             onClick={this.handleDuplicateDocumentClick}>
            <i className="fa fa-files-o" />
          </a>
          <a className="btn btn-danger btn-soft btn-xs" href="#" title="Remove document"
             onClick={this.handleDeleteDocumentClick}
             onDoubleClick={this.handleDeleteDocumentDoubleClick}>
            <i className="fa fa-trash" />
          </a>
        </td>
      </tr>
      <tr className="children hidden">
        <td colSpan={document.colspan}>
          {children.map(item => (
            <TreeView.DocumentRow key={item.keyValue} info={item} collection={this.props.collection} />
          ))}
        </td>
      </tr>
    </tbody>
  },

  handleToggleDocument(event) {
    event.preventDefault();

    $(event.currentTarget).next('.children').toggleClass('hidden');
  },

  handleActionClick(event) { // to prevent row opening / closing
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  },

  handleDuplicateDocumentClick(event) {
    event.preventDefault();

    Meteor.call('duplicateDocument', this.props.collection._id, this.props.document.value._id, (error, result) => {
      if (!error) {
        sAlert.success('Document duplicated.');
        this.props.fetchNewData();
      } else {
        sAlert.error('Could NOT duplicate document. Probably due to unique index.');
      }
    });

  },

  handleDeleteDocumentClick(event) {
    event.stopPropagation();

    showDeleteHint();
  },

  handleDeleteDocumentDoubleClick(event) {
    event.stopPropagation();

    showDeleteHint(false);
    Meteor.call('removeDocument', this.props.collection._id, this.props.document.value._id, (error, result) => {
      this.props.fetchNewData();
    })
  }

});


TreeView.DocumentRow = React.createClass({

  render() {
    const info = this.props.info;
    const parentRowClass = classNames({
      'row head': true,
      'toggle-children': info.hasChildren
    }, info.fieldClass);

    const children = TreeViewUtils.getChildren(info);

    let pinButton;
    if(!info.hasChildren) {
      pinButton = <div className="btn btn-link btn-xs control-icon pin-column" data-full-path={info.fullPath} onClick={this.handlePin}>
        {info.isPinned ? <i className="fa fa-thumb-tack text-danger" /> : <i className="fa fa-thumb-tack" />}
      </div>;
    }

    return <div className="parent col-xs-12">
      <div className={parentRowClass} onClick={this.handleToggleChildren}>
        <div className="col-xs-4 cell key">
          {info.drMongoIndex} <span className="value-type-label">{info.labelText}</span> {info.keyValue}
          {pinButton}
          <div className="btn btn-link btn-xs copy-value control-icon pull-right" onClick={this.handleCopyValue}>
            <i className="fa fa-clipboard" />
          </div>
        </div>
        <div className="col-xs-8 cell value">
          {info.formattedValue}&nbsp;
          {info.isPruned ? <ViewDocument.Modal text={info.notPrunedString} className="view-value"/> : null}

        </div>
      </div>
      {children ? this.renderRowChildren(children) : null}
    </div>
  },

  renderRowChildren(children) {
    return <div className="row children">
      {children.map(item => (
        <TreeView.DocumentRow key={item.keyValue} info={item} />
      ))}
    </div>
  },

  handleToggleChildren(event) {
    if ($(event.target).parent().is('.control-icon')) return true;

    event.preventDefault();
    $(event.currentTarget).parent('.parent').toggleClass('collapsed');
  },

  handleCopyValue(event) {
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();

    copyText(EJSON.stringify(this.props.info.value));
  },

  handlePin(event) {
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();

    const path = event.currentTarget.dataset['fullPath'];
    let pathFormatted = path.replace(/^\./, '');
    pathFormatted = pathFormatted.replace(/\.([0-9]+)$/g, '[$1]');
    pathFormatted = pathFormatted.replace(/\.([0-9]+)\./g, '[$1].');

    const collectionId = this.props.collection._id;
    var c = Collections.findOne(collectionId);
    if (c && c.pinnedColumns && _.contains(c.pinnedColumns, path)) {
      Collections.update(collectionId, {$pull: {pinnedColumns: path, pinnedColumnsFormatted: pathFormatted}});
    } else {
      Collections.update(collectionId, {$addToSet: {pinnedColumns: path, pinnedColumnsFormatted: pathFormatted}});
    }

  }

});

TreeView.Pagination = React.createClass({

  getDefaultProps() {
    return {
      pageLimit: 20,
      currentPage: 1
    }
  },

  render() {

    const totalCount = parseInt(this.props.totalCount);
    const currentPage = parseInt(this.props.currentPage);
    const pagesCount = Math.ceil(totalCount / parseInt(this.props.pageLimit));
    const groupClass = 'btn-group btn-group-sm';

    const previousPage = currentPage == 1 ? currentPage : currentPage - 1;
    const nextPage = currentPage == pagesCount ? currentPage : currentPage + 1;

    const pages = [];
    for (var i = 1; i < pagesCount; i++) {
      pages.push({
        index: i,
        label: i + '. page'
      });
    }

    return <div className={groupClass}>
      <button className="btn btn-default" key="0" onClick={this.handlePageChange.bind(this, 1)} ><i className="fa fa-angle-double-left" /></button>
      <button className="btn btn-default" key="1" onClick={this.handlePageChange.bind(this, previousPage)} ><i className="fa fa-angle-left" /></button>
      <div className={groupClass}>
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
          <span key="1">{currentPage} </span><span key="2" className="caret" />
        </button>
        <ul className="dropdown-menu">
          {pages.map(item => {
            return <li key={item.index}><a href="#" onClick={this.handlePageChange.bind(this, item.index)}>{item.label}</a></li>
          })}
        </ul>
      </div>
      <button className="btn btn-default" key="2" onClick={this.handlePageChange.bind(this, nextPage)} ><i className="fa fa-angle-right" /></button>
      <button className="btn btn-default" key="3" onClick={this.handlePageChange.bind(this, pagesCount)}><i className="fa fa-angle-double-right" /></button>
    </div>
  },

  handlePageChange(page, event) {
    event.preventDefault();
    event.currentTarget.blur();
    this.props.onPageChange(page);
  }

});
