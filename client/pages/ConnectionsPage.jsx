ConnectionsPage = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let data = {};

    // TODO subscribe to data?
    data.connections = Connections.find({}, {sort: {name: 1}}).fetch();

    return data;
  },

  render() {
    return <div>
      <div className="container">
        <div className="row p-t">
          <div className="col-sm-6 col-sm-push-3">
            <div className="list">
              {this.data.connections ? this.renderConnections() : <Loading />}
              <AddConnectionBlock />
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
  }

});


ConnectionBlock = ({connection}) => {
  const uri = MongodbUriParser.parse(connection.mongoUri);

  const editProps = {
    connection: connection
  };

  return <div className="list-item">
    <i className={connection.getIcon()} />
    <a className="m-l" href={RouterUtils.pathForMainDatabase(connection)}>{connection.name}</a>
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

    RouterUtils.redirect(RouterUtils.pathForMainDatabase(connection));
  }

});
