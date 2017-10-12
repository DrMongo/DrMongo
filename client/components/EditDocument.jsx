import React from 'react';
import { Modal } from 'react-bootstrap';

EditDocument = React.createClass({
  getDefaultProps() {
    return {
      editorId: 'edit'
    }
  },

  render() {
    const value = EJSON.stringify(this.props.document.value, {indent: '\t'});

    return <div>
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
        <button className="btn btn-primary pull-right" onClick={this.handleSave}>Save</button>
      </div>
    </div>
  },

  handleLoad(editor) {
    editor.getSession().setUseWrapMode(true);
    editor.gotoLine(1, 1);
    editor.focus();
  },

  handleSave(event) {
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
    const documentData = this.props.document.value;

    Meteor.call('updateDocument', this.props.collection._id, documentData._id, data, (error, result) => {
      this.props.onSave();
    });
  }
});


EditDocument.Modal = React.createClass({

  getInitialState() {
    return { showModal: false };
  },

  render() {

    const icon = this.props.icon ? <i className={this.props.icon} /> : null;

    const editProps = this.props.editProps;
    
    const onSave = editProps.onSave;
    editProps.onSave = () => {
      this.handleClose();
      if(editProps.onSave) {
        log('> editProps.onSave');
        setTimeout(() => { onSave(); }, 100);
      }
    };

    return <span>
      <a className={this.props.className} href="#" onClick={this.handleOpen} title="Edit document">{icon}{this.props.text}</a>

      <Modal show={this.state.showModal} onHide={this.handleClose} bsSize="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditDocument {...editProps} />
        </Modal.Body>
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
