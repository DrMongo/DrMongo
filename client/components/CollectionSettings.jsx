CollectionSettings = React.createClass({
  getInitialState() {
    Meteor.call('stats.rawCollectionStats', this.props.collection._id, (error, stats) => {
      if(error) {
        log(error);
      } else {
        this.setState({
          rawStats: JSON.stringify(stats, null, 2)
        });
      }
    })

    return { };
  },


  handleDropAllDocuments() {
    if (!confirm('Drop ALL documents in ' + this.props.collection.name + '?')) return false;

    Meteor.call('dropAllDocuments', this.props.collection._id, (error, stats) => {
      // refreshDocuments();
    });
  },

  render() {
    return <div>
      <h4>Actions</h4>
      <button className="btn btn-danger" onClick={this.handleDropAllDocuments}>Drop all documents...</button>
      <h4>Stats</h4>
      <pre>{this.state.rawStats}</pre>
    </div>
  }
});


CollectionSettings.Modal = React.createClass({

  getInitialState() {
    return { showModal: false };
  },

  render() {
    const icon = this.props.icon ? <i className={this.props.icon} /> : null;

    return <span>
      <button className={this.props.className} title="Collection Settings" onClick={this.handleOpen}>{icon}{this.props.text}</button>

      <Modal show={this.state.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.collection.name} - Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CollectionSettings collection={this.props.collection}/>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default" onClick={this.handleClose}>Close</button>
          <button className="btn btn-primary" onClick={this.handleInsert}>Save Changes</button>
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
