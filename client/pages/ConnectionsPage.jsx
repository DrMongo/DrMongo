ConnectionsPage = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let data = {};

    data.connections = Connections.find({}, {sort: {name: 1}}).fetch();
    return data;
  },

  getInitialState: function() {
    this.currentSettings = new CurrentSettings();
    return {settings: this.currentSettings.global};
  },

  render() {
    return <div id="connection-page">
      <div className="container">
        <div className="m-t-lg m-b text-center color-white">
          <h1><i className="fa fa-heartbeat" /> Dr. Mongo</h1>
        </div>
        <div className="row p-t">
          <div className="col-sm-8 col-sm-push-2 col-md-6 col-md-push-3 col-lg-4 col-lg-push-4">
            <ConnectionsPage.NewVersionMessage />
            <div className="list box-shadow-3">
              {this.data.connections ? this.renderConnections() : <Loading />}
              <AddConnectionBlock />
            </div>
          </div>
        </div>

        <div className="row p-t">
          <div className="col-sm-8 col-sm-push-2 col-md-6 col-md-push-3 col-lg-4 col-lg-push-4">
            <div className="list box-shadow-3">
              <div className="list-item text-center">
                <i className="fa fa-cog m-r" />
                Global Settings
              </div>
              <div className="list-item text-center">
                <input type="checkbox" value="1" name="open-first-document" id="open-first-document" checked={this.state.settings.openFirstDocument} onChange={this.handleOpenFirstDocument} className="m-r"/> Automatically expand first document
              </div>
              <div className="list-item text-center">
                Number of documents per page:
                <input type="text" value={this.state.settings.documentsPerPage} name="documents-per-page" id="documents-per-page" onChange={this.handleDocumentsPerPage} className="m-l"/> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  },

  renderConnections() {
    return this.data.connections.map((item) => {
      return <ConnectionBlock key={item._id} connection={item} />
    })
  },

  handleOpenFirstDocument(event) {
    let status = $(event.currentTarget).is(':checked');

    this.currentSettings.setGlobal('openFirstDocument', status);

    let currentState = this.state;
    currentState.settings.openFirstDocument = status;
    this.setState(currentState);
  }, 

  handleDocumentsPerPage(event) {
    let status = $(event.currentTarget).val();

    this.currentSettings.setGlobal('documentsPerPage', parseInt(status));

    let currentState = this.state;
    currentState.settings.documentsPerPage = parseInt(status);
    this.setState(currentState);
  }

});

ConnectionsPage.NewVersionMessage = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let data = {};

    data.version = DrmVersion.findDocument();

    return data;
  },


  render() {
    if(this.data.version && this.data.version.newVersionAvailable) {
      return (
        <div className="alert alert-warning box-shadow-4">
          <span>New version of Dr. Mongo is available! </span>
          <a href="https://github.com/DrMongo/DrMongo/blob/master/README.md#update" target="_blank">read more</a>
        </div>
      );
    } else {
      return null;
    }
  }
});


ConnectionBlock = ({connection}) => {
  const editProps = {
    connection: connection
  };

  return <div className="list-item">
    <i className={connection.getIcon()} />
    <a className="m-l" href={RouterUtils.pathForDefaultDatabase(connection)}>{connection.name}</a>
    <EditConnection.Modal className="small pull-right" icon="fa fa-pencil" editProps={editProps} />
  </div>
};

AddConnectionBlock = React.createClass({

  render() {
    const editProps = {
      onSave: this.handleSave
    };

    return <div className="list-item">
      <EditConnection.Modal text="Add new connection" editProps={editProps} />
    </div>
  },

  handleSave(connectionId) {
    const connection = Connections.findOne(connectionId);

    RouterUtils.redirect(RouterUtils.pathForDefaultDatabase(connection));
  }

});
