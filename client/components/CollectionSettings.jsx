CollectionSettings = React.createClass({

  getInitialState() {
    return {};
  },

  componentWillMount() {
    this.updateStats(this.props);
  },

  componentWillUpdate(nextProps) {
    log(nextProps)
    this.updateStats(nextProps);
  },


  handleDropAllDocuments() {
    Meteor.call('dropAllDocuments', this.props.collection._id, (error, stats) => {
      if(error) {
        sAlert.error('Error, sry :/');
        log(error);
      } else {
        sAlert.success('Collection dropped');
        // @TODO refresh documents
      }
      this.props.onCollectionDroped();
    });
  },

  render() {
    return <div>
      <h4>Indexes</h4>
      <table className="table table-hover">
        <tbody>
          <tr>
            <td>nieco</td>
          </tr>
        </tbody>
      </table>
      <h4>Stats</h4>
      <pre>{this.state.rawStats}</pre>
      <ConfirmButton className="btn btn-danger btn-inverted btn-xs" type="button" text="Drop all documents" confirmText="Confirm: Drop all documents" onConfirm={this.handleDropAllDocuments} />
    </div>
  },

  updateStats(props) {
    Meteor.call('stats.rawCollectionStats', props.collection._id, (error, stats) => {
      if(error) {
        log(error);
      } else {
        this.setState({
          rawStats: JSON.stringify(stats, null, 2)
        });
      }
    });

    Meteor.call('stats.fetchCollectionIndexes', props.collection._id, (error, stats) => {
      log(stats)
      if(error) {
        log(error);
      } else {
        this.setState({
          indexes: stats
        });
      }
    });

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
          <Modal.Title>{this.props.collection.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CollectionSettings collection={this.props.collection} onCollectionDroped={this.handleClose} />
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
