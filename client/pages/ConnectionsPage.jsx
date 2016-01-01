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
        <div className="row bg-box p-t m-t">
          {this.data.connections ? this.renderConnections() : <Loading />}
          <AddConnectionBlock />
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
  const host = checkNested(uri, 'hosts', 0) ? uri.hosts[0] : null;
  const hostValue = (host.host ? host.host : '') + ':' + (host.port ? host.port : '');
  const databaseValue = uri.database ? <div className="small">Database: {uri.database}</div> : null;
  const userValue = uri.username ? <div className="small">User: {uri.username}</div> : null;

  const editProps = {
    connection: connection
  };

  return <div className="col-md-4 col-lg-3">
    <div className="connection-card">
      <i className="fa fa-bolt connection-icon" />
      <div className="title m-b-sm relative">
        <a href={RouterUtils.pathForMainDatabase(connection)}>{connection.name}</a>
        <EditConnection.Modal className="small pull-right" text="edit" editProps={editProps} />
      </div>
      <div className="small">{hostValue}</div>
      {databaseValue}
      {userValue}
    </div>
  </div>
};

AddConnectionBlock = React.createClass({

  render() {
    const editProps = {
      onSave: this.handleSave
    };
    return <div className="col-md-4 col-lg-3">
      <div className="add-connection">
        <div className="card-content">
          <EditConnection.Modal className="btn btn-primary btn-soft" text="Add new connection" editProps={editProps} />
        </div>
      </div>
    </div>
  },

  handleSave(connectionId) {
    const connection = Connections.findOne(connectionId);

    RouterUtils.redirect(RouterUtils.pathForMainDatabase(connection));
  }

});
