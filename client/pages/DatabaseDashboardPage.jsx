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
      <h1 className="page-header"><i className="fa fa-database" /> {env.database.name}</h1>

      {!collections ? <Loading /> : this.renderCollections()}
    </div>
  },

  renderCollections() {
    return <table className="collections-table table">
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
     <CollectionSettings.Modal className="btn btn-warning btn-xs btn-soft pull-right" icon="fa fa-cog" text=" Settings" collection={collection} />
    </td>
  </tr>
);
