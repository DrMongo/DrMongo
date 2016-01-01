EditConnection = React.createClass({
  render() {

    let connection;
    let deleteButton;
    if(!this.props.connection) {
      connection = {};
      deleteButton = null;
    } else {
      connection = this.props.connection;
      deleteButton = <ConfirmButton className="btn btn-danger btn-inverted" text="Delete" confirmText="Confirm delete action" onConfirm={this.handleDelete} />
    }


    return <div>

      <Formsy.Form>
        <div className="form-group">
          <label>Name</label>
          <div className="input-group">
            <div className="input-group-addon"><i className="fa fa-font" /></div>
            <MyInput className="form-control" name="name" value={connection.name} type="text" placeholder="Name your connection" autoComplete="off" />
          </div>
        </div>

        <div className="form-group">
          <label>Mongo URI</label>
          <div className="input-group">
            <div className="input-group-addon"><i className="fa fa-globe" /></div>
            <MyInput className="form-control" name="uri" value={connection.mongoUri} type="text" placeholder="mongodb://[username:password@]host1[/[database][?options]]" autoComplete="off" />
          </div>
          <p className="help-block">
            <a href="https://docs.mongodb.org/manual/reference/connection-string/" target="_blank">What is Mongo URI?</a>
            <br/>Use '127.0.0.1' instead of 'localhost' if possible. Mongo connection fails if working offline and using 'localhost'.
          </p>
        </div>

        <div className="m-t clearfix">
          {deleteButton}
          <input className="btn btn-success btn-inverted pull-right" type="submit" value="Save" onClick={this.handleSave} />
        </div>
      </Formsy.Form>

    </div>
  },

  handleSubmit(values) {
    const mongoUri = values.uri;
    let uri;
    if(mongoUri) {
      uri = MongodbUriParser.parse(mongoUri);
    } else {
      uri = {};
    }

    const data = {
      name: values.name || 'New Connection',
      mongoUri: mongoUri || 'mongodb://localhost:27017',
      database: uri.database || null
    };

    let connectionId;
    if(this.props.connection) {
      connectionId = this.props.connection._id;
      Connections.update(connectionId, { $set: data });
    } else {
      connectionId = Connections.insert(data);
    }

    Meteor.call('updateConnectionStructure', connectionId, (error, result) => {
      log(error, result)
    });

    this.props.onSave(connectionId);
  },

  handleDelete() {
    if(this.props.connection) {
      Connections.remove(this.props.connection._id);
    }

    this.props.onDelete();
  }
});


EditConnection.Modal = React.createClass({

  getInitialState() {
    return { showModal: false };
  },

  render() {

    const icon = this.props.icon ? <i className={this.props.icon} /> : null;

    const editProps = this.props.editProps;
    const onSave = editProps.onSave;
    editProps.onSave = (connectionId) => {
      this.handleClose();
      if(typeof onSave === 'function') {
        setTimeout(() => { onSave(connectionId); }, 100);
      }
    };

    editProps.onDetele = this.handleClose;

    return <span>
      <a className={this.props.className} href="#" onClick={this.handleOpen} title="Edit connection">{icon}{this.props.text}</a>

      <Modal show={this.state.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Connection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditConnection {...editProps} />
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
