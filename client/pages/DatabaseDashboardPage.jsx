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

      {!collections ? <Loading /> : this.renderCollections()}
    </div>
  },

  renderCollections() {
    return <table className="table table-hover">
      <tbody>
        {this.data.collections.map((item, index) => {
          return <CollectionItem key={item._id} collection={item} index={index} />
        })}
      </tbody>
    </table>
  }
});


CollectionItem = ({collection, index}) => (
  <tr>
    <td>
      {index+1}. <a href={RouterUtils.pathForDocuments(collection)}>{collection.name}</a>
    </td>
    <td>
     <CollectionSettings.Modal className="theme-color btn btn-warning btn-xs pull-right" title="Collection Settings" icon="" collection={collection} text="Settings"/>
     <a className="theme-color btn btn-success btn-xs m-r pull-right" role="button" href={RouterUtils.pathForDocuments(collection)}>View documents</a>
    </td>
  </tr>
);
