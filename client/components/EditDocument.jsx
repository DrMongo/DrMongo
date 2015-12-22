EditDocument = React.createClass({
  render() {
    return <div>
      <h1>edit me!</h1>
      <h3>{this.props.document.value._id}</h3>
    </div>
  }
});


EditDocument.Modal = React.createClass({

  getInitialState() {
    return { showModal: false };
  },

  render() {

    const icon = this.props.icon ? <i className={this.props.icon} /> : null;

    return <span>
      <a className={this.props.className} href="#" onClick={this.handleOpen}>{icon}{this.props.text}</a>

      <Modal show={this.state.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditDocument {...this.props.editProps} />
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
