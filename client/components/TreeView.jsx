TreeView = React.createClass({

  componentDidMount() {
    // @TODO auto open first row
  },

  render() {
    const documents = this.props.documents;

    return <div>
      {documents.length == 0 ? this.renderZeroResults() : this.renderResults()}
    </div>
  },


  renderZeroResults() {
    return <h2 className="text-center p-t-md">No results.</h2>
  },

  renderResults() {
    return <table className="table tree-view">
      <thead>
        <tr className="column-headers">
          <td className="cell key">#. _id</td>
          <td>pinned columns @TODO</td>
          <td />
        </tr>
      </thead>
      {this.props.documents.map(item => (
        <TreeView.Document key={item.keyValue} document={item} />
      ))}
    </table>
  }

});


TreeView.Document = React.createClass({

  render() {
    const document = this.props.document;

    const rowClass = 'parent document' + (document.hasChildren ? ' toggle-children' : '');
    const children = TreeViewUtils.getChildren(document);

    return <tbody>
      <tr className={rowClass} onClick={this.handleToggleDocument}>
        <td className="cell key">{document.idValue}</td>
        <td className="cell pinned">pinned columns @TODO</td>
        <td className="cell actions text-right">
          Actions @TODO
        </td>
      </tr>
      <tr className="children hidden">
        <td colSpan="2">
          {children.map(item => (
            <TreeView.DocumentRow key={item.keyValue} info={item} />
          ))}
        </td>
      </tr>
    </tbody>
  },

  handleToggleDocument(event) {
    event.preventDefault();

    $(event.currentTarget).next('.children').toggleClass('hidden');
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

    return <div className="parent">
      <div className={parentRowClass} onClick={this.handleToggleChildren}>
        <div className="col-xs-3 cell key">
          {info.drMongoIndex} <span className="value-type-label">{info.labelText}</span> {info.keyValue}
          <div className="btn btn-link btn-xs copy-value control-icon pull-right">
            <i className="fa fa-clipboard" />
          </div>
        </div>
        <div className="col-xs-7 cell value">
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
  }

});
