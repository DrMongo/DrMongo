ConnectionsPage = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let data = {};

    // TODO subscribe to data?
    data.connections = Connections.find({}).fetch();

    return data;
  },

  render() {
    return <div>
      <div className="db-theme">
        <div className="container">
          <h1 className="m-b">Connections</h1>
        </div>
      </div>

      <div className="container">
        <div className="row bg-box p-t m-t">
          {this.data.connections ? this.renderConnections() : <Loading />}
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
  return <div className="col-md-4 col-lg-3">
    <div className="connection-card">
      <i className="fa fa-bolt pull-right connection-icon" />
      <div className="title">
        <a href={RouterUtils.pathForMainDatabase(connection)} className="mini ui green button">{connection.name}</a>
      </div>
      <div>{connection.shortMongoUri()}</div>
    </div>
  </div>
};
