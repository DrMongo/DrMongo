import React from 'react';
import { Modal } from 'react-bootstrap';

CollectionSettings = React.createClass({

  getInitialState() {
    return {};
  },

  componentWillMount() {
    this.updateStats(this.props);
  },

  componentWillReceiveProps(nextProps) {
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
      <table className="table table-small">
        <thead>
          <th>Name</th>
          <th>Key</th>
          <th>
            <ConfirmButton className="btn btn-danger btn-inverted btn-xs pull-right hide" type="button" text="Drop all indexes" confirmText="Confirm: Drop all indexes" onConfirm={this.handleDropAllIndexes} />
        </th>
        </thead>
        <tbody>
          {this.state.indexes ? this.state.indexes.map((item) => (
          <tr>
            <td>{item.name}</td>
            <td>{JSON.stringify(item.key)}</td>
            <td>
              <ConfirmButton className="btn btn-danger btn-inverted btn-xs pull-right hide" type="button" text="Drop" confirmText="Confirm: Drop index" onConfirm={this.handleDropIndex} />
            </td>
          </tr>
          )) : ''}
        </tbody>
      </table>
      <h4>Stats</h4>
      <pre>{this.state.rawStats}</pre>
      <ConfirmButton className="btn btn-danger btn-inverted btn-xs" type="button" text="Drop all documents" confirmText="Confirm: Drop all documents" onConfirm={this.handleDropAllDocuments} />
    </div>
  },

  updateStats(props) {
    Meteor.call('stats.getCollectionInfo', props.collection._id, (error, result) => {
      if(error) {
        log(error);
      } else {
        this.setState({
          rawStats: JSON.stringify(result.stats, null, 2),
          indexes: result.indexes
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
