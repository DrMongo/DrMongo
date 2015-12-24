InsertDocument = React.createClass({
  render() {
    return <div>
      <h1>Insert new document: {this.props.collection.name}</h1>
      <textarea id="insert-document">{}</textarea>
    </div>
  }
});


InsertDocument.Modal = React.createClass({

  getInitialState() {
    return { showModal: false };
  },

  render() {
    const icon = this.props.icon ? <i className={this.props.icon} /> : null;

    return <span>
      <button className="theme-color btn btn-inverted btn-sm" title="Insert new document" onClick={this.handleOpen}>
        <i className="fa fa-plus" />
      </button>

      <Modal show={this.state.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Insert new document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InsertDocument collection={this.props.collection}/>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default" onClick={this.handleClose}>Close</button>
          <button className="btn btn-primary" onClick={this.handleInsert}>Insert Document</button>
        </Modal.Footer>
      </Modal>
    </span>
  },

  handleClose() {
    this.setState({ showModal: false });
  },

  handleOpen() {
    this.setState({ showModal: true });
  }, 

  handleInsert() {
    const newDoc = $('#insert-document').val();
    log(newDoc)
  }
});
