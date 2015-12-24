DatabaseDashboardPage = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let data = {};
    const env = this.props.currentEnvironment;

    // TODO subscribe to data?
    data.collections = env.database.collections();

    return data;
  },


  render() {
    const env = this.props.currentEnvironment;
    const collections = this.data.collections;

    return <div className="container bg-box m-t-md p-t">
      <a className="btn btn-success pull-right" role="button" href={RouterUtils.pathForConsole(env.database)}>Console</a>
      <h1 className="page-header"><i className="fa fa-database" /> {env.database.name}</h1>

      <h4>Collections</h4>
      {!collections ? <Loading /> : this.renderCollections()}
    </div>
  },

  renderCollections() {
    return <table className="table table-hover">
      <tbody>
        {this.data.collections.map(item => {
          return <CollectionItem key={item._id} collection={item} />
        })}
      </tbody>
    </table>
  }
});


CollectionItem = ({collection}) => (
  <tr>
    <td>
      <a href={RouterUtils.pathForDocuments(collection)}>{collection.name}</a>
    </td>
    <td>
      <CollectionSettings.Modal className="theme-color btn btn-info btn-xs" title="Collection Settings" icon="fa fa-cog" collection={collection}/>
    </td>
  </tr>
);
