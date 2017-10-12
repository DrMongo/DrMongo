import React from 'react';
import { Modal } from 'react-bootstrap';

InsertDocument = React.createClass({
  getDefaultProps() {
    return {
      editorId: 'insert-document'
    }
  },


  render() {
    const value = EJSON.stringify(this.props.value, {indent: '\t'}) || '{}';

    return <div>
      <h1>Insert new document: {this.props.collection.name}</h1>
      <ReactAce
        value={value}
        mode="json"
        theme="chrome"
        name={this.props.editorId}
        width="100%"
        onLoad={this.handleLoad}
        editorProps={{$blockScrolling: true}}
      />
      <div className="m-t clearfix">
        <button className="btn btn-primary pull-right" onClick={this.handleSave}>Insert</button>
      </div>
    </div>
  },

  handleLoad(editor) {
    editor.getSession().setUseWrapMode(true);
    editor.gotoLine(1, 1);
    editor.focus();
  },

  handleSave() {
    event.preventDefault();

    var data = ace.edit(this.props.editorId).getValue();
    data = processJson(data);

    if (data === false) {
      sAlert.error('Error parsing JSON!');
      return false;
    }

    try {
      data = EJSON.parse(data);
    } catch (error) {
      sAlert.error('Invalid JSON format!');
      return false;
    }

    Meteor.call('insertDocument', this.props.collection._id, data, (error, result) => {
      if(error) {
        sAlert.error('Error, sorry :(');
        log(error);
      } else {
        if (result == false) {
          sAlert.error('Insert FAILED. Probably UNIQUE key issue.');
          return;
        }
        let filterId = FilterHistory.insert({
          createdAt: new Date(),
          collection_id: this.props.collection._id,
          name: null,
          filter: result.insertedId
        });

        let viewUrl = RouterUtils.pathForDocuments(this.props.collection, filterId);
        sAlert.success('<p>Document created!<p><a class="btn btn-primary btn-small" href=' + viewUrl + '>View document</a>', {html: true});
      }
      this.props.onSave()
    });
  }
});


InsertDocument.Modal = React.createClass({

  getInitialState() {
    return { showModal: false };
  },

  render() {
    const icon = this.props.icon ? <i className={this.props.icon} /> : null;

    return <span>
      <button className={this.props.className} title={this.props.title} onClick={this.handleOpen}>{icon}</button>

      <Modal show={this.state.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Insert new document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InsertDocument collection={this.props.collection} onSave={this.handleClose} value={this.props.value}/>
        </Modal.Body>
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
    let newDoc = $('#insert-document').val();
    newDoc = JSON.parse(newDoc);
    log(newDoc)

    Meteor.call('insertDocument', this.props.collection._id, newDoc, (error, result) => {
      log(error, result)
      this.setState({showModal: false});
      // refreshDocuments(); @TODO ako toto spravit?
    });
  }
});
