ConnectionDashboardPage = React.createClass({

  mixins: [ReactMeteorData],

  componentWillMount() {
    this.setState({searching: true});
    updateConnectionStructure(this.props.connectionId, function() {
      this.setState({searching: false});     
    })
  },

  getMeteorData() {
    let data = {};

    const connectionSlug = this.props.connection;
    const handle = Meteor.subscribe('databases', connectionSlug);
    if (handle.ready()) {
      data.connection = Connections.findOne({slug: connectionSlug});
    }

    return data;
  },


  render() {
    const connection = this.data.connection;
    if(!connection) return <Loading />;

    const databases = connection.databases();
    let databasesList = databases.map((item, index) => {
      return <DatabaseItem key={item._id} database={item} index={index} />
    });

    return <div id="connection-page">
      <div className="container">
        <div className="m-t-lg m-b text-center color-white">
          <h1><i className="fa fa-heartbeat" /> Dr. Mongo</h1>
        </div>
        <div className="row p-t">
          <div className="col-sm-8 col-sm-push-2 col-md-6 col-md-push-3 col-lg-4 col-lg-push-4">
            <div className="list box-shadow-3">
              <div className="list-item">
                <div className="h3">
                  <i className={connection.getIcon()} /> {connection.name}
                  &nbsp; {this.state.searching ? <i className="fa fa-spinner fa-spin"></i> : ''}

                  <span className="pull-right">
                    <a className="small" href="/">change</a>
                  </span>
                </div>
              </div>
              {connection ? databasesList : <Loading />}
            </div>
          </div>
        </div>
      </div>
    </div>
  }
});


DatabaseItem = ({database, index}) => {
  const iconClass = 'list-item db-theme-' + database.getTheme();

  return <div className={iconClass}>
    <i className="fa fa-database db-theme-inverted" />
    <a className="m-l" href={RouterUtils.pathForDatabaseDashboard(database)}>{database.name}</a>
  </div>
};
