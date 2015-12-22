TreeView = React.createClass({

  componentDidMount() {
    // @TODO auto open first row
  },

  render() {
    const collection = this.props.collection;
    const documents = this.props.documents;

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
      return <h2 className="text-center p-t-md">No results.</h2>;
    } else {
      results = this.props.documents.map(item => (<TreeView.Document key={item.keyValue} document={item} collection={collection} />));
    }

    return <table className="table tree-view">
      <thead>
      <tr className="column-headers">
        <td className="cell key">#. _id</td>
        {pinnedColumns.map(item => (<td className="cell pinned" key={item}>{item}</td>))}
        <td>
          <div className="pull-right">
            <span className="m-r-sm">{this.props.totalCount}x</span>
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

TreeView.Document = React.createClass({

  render() {
    const document = this.props.document;

    const rowClass = 'parent document' + (document.hasChildren ? ' toggle-children' : '');
    const children = TreeViewUtils.getChildren(document);

    const pinnedColumns = [];
    let key = 0;
    document.pinnedColumns.map(item => {
      pinnedColumns.push({key: key++, value: item});
    });

    const editProps = {
      document: document
    };

    return <tbody>
      <tr className={rowClass} onClick={this.handleToggleDocument}>
        <td className="cell key">
          <span className="drm-index">{document.drMongoIndex}.</span> {document.keyValue} <small>{document.formattedValue}</small>
        </td>
        {pinnedColumns.map(item => (<td className="cell pinned" key={item.key}>{item.value}</td>))}
        <td className="cell actions text-right">
          <div className="dropdown inline-block" onClick={this.handleActionClick}>
            <div className="dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown">
              actions <span className="caret" />
            </div>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li><EditDocument.Modal className="nnn" title=" Edit" icon="fa fa-pencil" editProps={editProps} /></li>
            </ul>
          </div>
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

  handleActionClick(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
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
          {info.formattedValue}
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
