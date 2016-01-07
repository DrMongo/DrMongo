ConnectionDashboardPage = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let data = {};
    const env = this.props.currentEnvironment;

    // TODO subscribe to data?
    data.databases = env.connection.databases();

    return data;
  },


  render() {
    const env = this.props.currentEnvironment;
    const databases = this.data.databases;

    return <div className="container">
      <div className="bg-box m-t p-t">
        <div className="p-x">
          <h1 className="page-header"><i className="fa fa-bolt" /> {env.connection.name}</h1>
        </div>

        {!databases ? <Loading /> : this.renderDatabases()}
      </div>
    </div>
  },

  renderDatabases() {
    return <table className="table table-hover">
      <tbody>
        {this.data.databases.map((item, index) => {
          return <DatabaseItem key={item._id} database={item} index={index} />
        })}
      </tbody>
    </table>
  }
});


DatabaseItem = ({database, index}) => (
  <tr>
    <td>
      {index+1}. <a href={RouterUtils.pathForDatabaseDashboard(database)}>{database.name}</a>
    </td>
  </tr>
);
