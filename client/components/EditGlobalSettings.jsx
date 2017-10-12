import React from 'react';
import { Modal } from 'react-bootstrap';

EditGlobalSettings = React.createClass({

  getInitialState: function() {
    this.currentSettings = new CurrentSettings();
    return {settings: this.currentSettings.global};
  },

  render() {

    let options = [5,10,20,40,60,100,140,180,250];
    options = options.map(item => ({value: item, title: item}));


    return (
      <Formsy.Form>
        <div className="checkbox">
          <label>
            <input id="open-first-document" type="checkbox" value="1" name="open-first-document" checked={this.state.settings.openFirstDocument} onChange={this.handleOpenFirstDocument} className="m-r"/> Automatically expand first document
          </label>
        </div>
        <MySelect title="Number of documents per page:" name="documents-per-page" options={options} onChange={this.handleDocumentsPerPage} value={this.state.settings.documentsPerPage} />
      </Formsy.Form>
    );
  },

  handleOpenFirstDocument(event) {
    let status = $(event.currentTarget).is(':checked');

    this.currentSettings.setGlobal('openFirstDocument', status);

    let currentState = this.state;
    currentState.settings.openFirstDocument = status;
    this.setState(currentState);
    sAlert.success('Saved!');
  },

  handleDocumentsPerPage(value) {
    this.currentSettings.setGlobal('documentsPerPage', parseInt(value));
    sAlert.success('Saved!');
  }

});



EditGlobalSettings.Modal = React.createClass({

  getInitialState() {
    return { showModal: false };
  },

  render() {

    const icon = this.props.icon ? <i className={this.props.icon} /> : null;

    const editProps = this.props.editProps;

    return <span>
      <a className={this.props.className} href="#" onClick={this.handleOpen} title="Global settings">{icon}{this.props.text}</a>

      <Modal show={this.state.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Global settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditGlobalSettings {...editProps} />
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
