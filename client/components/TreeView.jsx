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
        let info = TreeViewUtils.getRowInfo(stringifyMongoId(row._id), row, 0, '');
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
    const collection = this.props.env.collection;
    const documents = this.state.documents;

    let pinnedColumns = [];
    if (collection.pinnedColumnsFormatted) {
      pinnedColumns = collection.pinnedColumnsFormatted;
    } else {
      pinnedColumns.push('');
      pinnedColumns.push('');
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
        <td className="cell key">#. _id</td>
        {pinnedColumns.map((item, index) => (<td className="cell pinned" key={index}>{item}</td>))}
        <td>
          <div className="pull-right">
            <span className="m-r-sm">{this.state.totalCount}x</span>
            <TreeView.Pagination pageLimit={collection.paginationLimit}
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
  }

});


TreeView.Document = React.createClass({

  render() {
    const document = this.props.document;

    const rowClass = 'parent document' + (document.hasChildren ? ' toggle-children' : '');
    const children = TreeViewUtils.getChildren(document);

    let pinnedColumns;
    if (document.pinnedColumns) {
      pinnedColumns = document.pinnedColumns.map((item, index) => (<td className="cell pinned" key={index}>{item}</td>));
    }

    const editProps = {
      document: document,
      collection: this.props.env.collection,
      onSave: this.props.refreshDocuments
    };

    return <tbody>
      <tr className={rowClass} onClick={this.handleToggleDocument}>
        <td className="cell key">
          <span className="drm-index">{document.drMongoIndex}.</span> {document.keyValue} <small>{document.formattedValue}</small>
        </td>
        {pinnedColumns}
        <td className="cell actions text-right">
          <EditDocument.Modal className="btn btn-primary btn-soft btn-xs" icon="fa fa-pencil" editProps={editProps} />
          <button className="btn btn-warning btn-soft btn-xs" title="Duplicate document"
             onClick={this.handleDuplicateDocumentClick}
             onDoubleClick={this.handleDuplicateDocumentDoubleClick}>
            <i className="fa fa-files-o" />
          </button>
          <button className="btn btn-danger btn-soft btn-xs" title="Remove document"
             onClick={this.handleDeleteDocumentClick}
             onDoubleClick={this.handleDeleteDocumentDoubleClick}>
            <i className="fa fa-trash" />
          </button>
        </td>
      </tr>
      <tr className="children hidden">
        <td colSpan={document.colspan}>
          {children.map(item => (
            <TreeView.DocumentRow key={item.keyValue} info={item} env={this.props.env} />
          ))}
        </td>
      </tr>
    </tbody>
  },

  handleToggleDocument(event) {
    event.preventDefault();

    $(event.currentTarget).next('.children').toggleClass('hidden');
  },

  handleDuplicateDocumentClick(event) {
    event.stopPropagation();

    showHint('duplicate', 'Psst!! Hey you! Try double click...');
  },

  handleDuplicateDocumentDoubleClick(event) {
    event.preventDefault();

    showHint('duplicate', false);
    Meteor.call('duplicateDocument', this.props.env.collectionId, this.props.document.value._id, (error, result) => {
      if (!error) {
        sAlert.success('Document duplicated.');
        this.props.refreshDocuments();
      } else {
        sAlert.error('Could NOT duplicate document. Probably due to unique index.');
      }
    });

  },

  handleDeleteDocumentClick(event) {
    event.stopPropagation();

    showHint('delete', 'Psst!! Hey you! Try double click...');
  },

  handleDeleteDocumentDoubleClick(event) {
    event.stopPropagation();

    showHint('delete', false);
    Meteor.call('removeDocument', this.props.env.collectionId, this.props.document.value._id, (error, result) => {
      this.props.refreshDocuments();
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


    let formattedValue;
    if(info.isId) {
      formattedValue = <a href="#" onClick={this.handleFindById}>{info.formattedValue}</a>
    } else {
      formattedValue = info.formattedValue;
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
          {formattedValue}&nbsp;
          {info.isPruned ? <ViewDocument.Modal text={info.notPrunedString} className="view-value"/> : null}
        </div>
      </div>
      {children ? this.renderRowChildren(children) : null}
    </div>
  },

  renderRowChildren(children) {
    return <div className="row children">
      {children.map(item => (
        <TreeView.DocumentRow key={item.keyValue} info={item} env={this.props.env} />
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

    const collectionId = this.props.env.collectionId;
    var c = Collections.findOne(collectionId);
    if (c && c.pinnedColumns && _.contains(c.pinnedColumns, path)) {
      Collections.update(collectionId, {$pull: {pinnedColumns: path, pinnedColumnsFormatted: pathFormatted}});
    } else {
      Collections.update(collectionId, {$addToSet: {pinnedColumns: path, pinnedColumnsFormatted: pathFormatted}});
    }

  },

  handleFindById(event) {
    event.preventDefault();

    const databaseId = this.props.env.databaseId;
    const id = this.props.info.idValue;

    Meteor.call('findCollectionForDocumentId', databaseId, id, (error, result) => {
      if (result === null) {
        sAlert.warning('Document not found.');
      }

      let c = Collections.findOne({database_id: databaseId, name: result});
      if (c) {
        let filterId = FilterHistory.insert({
          createdAt: new Date(),
          collection_id: CurrentSession.collection._id,
          name: null,
          filter: id
        });

        RouterUtils.redirect(RouterUtils.pathForDocuments(c, filterId))
      }
    });


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
    const groupClass = 'btn-group btn-group-thin';

    const previousPage = currentPage == 1 ? currentPage : currentPage - 1;
    const nextPage = currentPage == pagesCount ? currentPage : currentPage + 1;

    const pages = [];
    for (var i = 1; i <= pagesCount; i++) {
      pages.push({
        index: i,
        label: i + '. page'
      });
    }

    classForButton = (disabled) => {
      return classNames('btn btn-default', {'disabled': disabled});
    };

    return <div className={groupClass}>
      <button className={classForButton(currentPage == 1)} key="0" onClick={this.handlePageChange.bind(this, 1)} ><i className="fa fa-angle-double-left" /></button>
      <button className={classForButton(currentPage == 1)} key="1" onClick={this.handlePageChange.bind(this, previousPage)} ><i className="fa fa-angle-left" /></button>
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
      <button className={classForButton(currentPage == pagesCount)} key="2" onClick={this.handlePageChange.bind(this, nextPage)} ><i className="fa fa-angle-right" /></button>
      <button className={classForButton(currentPage == pagesCount)} key="3" onClick={this.handlePageChange.bind(this, pagesCount)}><i className="fa fa-angle-double-right" /></button>
    </div>
  },

  handlePageChange(page, event) {
    event.preventDefault();
    event.currentTarget.blur();
    this.props.onPageChange(page);
  }

});
