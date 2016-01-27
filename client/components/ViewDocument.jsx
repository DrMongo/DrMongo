ViewDocument = React.createClass({
  render() {
    return <div>
      <div>{this.props.text}</div>
    </div>
  }
});


ViewDocument.Modal = React.createClass({

  getInitialState() {
    return { showModal: false };
  },

  render() {
    return <span>
      <a className={this.props.className} href="#" onClick={this.handleOpen}>view</a>

      <Modal show={this.state.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>View attribute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ViewDocument {...this.props} />
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default" onClick={this.handleClose}>Close</button>
        </Modal.Footer>
      </Modal>
    </span>
  },

  handleClose() {
    this.setState({ showModal: false });
  },

  handleOpen() {
    this.setState({ showModal: true });
  }
});
