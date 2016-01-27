InsertDocument = React.createClass({
  getDefaultProps() {
    return {
      editorId: 'insert-document'
    }
  },


  render() {
    const value = '{}';

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
    try {
      data = EJSON.parse(data);
    } catch (error) {
      sAlert.error('Invalid JSON format!');
      return false;
    }

    Meteor.call('insertDocument', this.props.collection._id, data, (error, result) => {
      if(error) {
        sAlert.error('Error, sry :/');
        log(error);
      } else {
        sAlert.success('Document created!');
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
      <button className="theme-color btn btn-inverted btn-sm" title="Insert new document" onClick={this.handleOpen}>{icon}</button>

      <Modal show={this.state.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Insert new document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InsertDocument collection={this.props.collection} onSave={this.handleClose} />
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
