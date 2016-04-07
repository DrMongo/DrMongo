DatabaseDashboardPage = React.createClass({

  mixins: [ReactMeteorData],

  componentWillMount() {
    updateConnectionStructure(this.props.currentEnvironment.connectionId);
  },

  getMeteorData() {
    let data = {};
    const env = this.props.currentEnvironment;

    // TODO subscribe to data?
    data.collections = env.database.collections();

    return data;
  },

  componentDidMount() {
    Meteor.call('stats.fetchCollectionsStats', this.props.currentEnvironment.databaseId, (error, result) => {
      if(error) {
        log(error);
      } else {
        // done
      }
    });
  },


  render() {
    const env = this.props.currentEnvironment;
    const collections = this.data.collections;

    let themes = [
      'dark-blue',
      'dark-teal',
      'blue',
      'light-blue',
      'green',
      'brown',
      'orange',
      'red',
      'purple'
    ];

    themes = themes.map(name => {
      let className = 'p-l-sm db-theme-' + name;
      return <a className={className} key={name} href="#" onClick={this.handleChangeTheme.bind(null, name)}><i className="fa fa-database db-theme-inverted"/></a>
    });

    return <div className="container">
      <div className="bg-box m-t p-t">
        <div className="p-x">
          <div className="pull-right database-colors db-theme-shadow-box">{themes}</div>
          <h1 className="page-header"><i className="fa fa-database" /> {env.database.name}</h1>
        </div>

        {!collections ? <Loading /> : this.renderCollections()}
      </div>
    </div>
  },

  renderCollections() {
    return <table className="table table-hover">
      <thead>
        <tr>
          <td />
          <td className="text-right">Documents</td>
          <td className="text-right">Indexes</td>
          <td className="text-right">Size</td>
          <td />
        </tr>
      </thead>
      <tbody>
        {this.data.collections.map((item, index) => {
          return <CollectionItem key={item._id} collection={item} index={index} />
        })}
      </tbody>
    </table>
  },

  handleChangeTheme(name, event) {
    event.preventDefault();

    Databases.update(this.props.currentEnvironment.databaseId, {$set: {theme: name}});
  }
});


CollectionItem = ({collection, index}) => {
  const stats = collection.stats || {};

  return <tr>
    <td>
      {index + 1}. <a
      href={RouterUtils.pathForDocuments(collection)}>{collection.name}</a>
    </td>
    <td className="text-right">{stats.documentsCount}</td>
    <td className="text-right">{stats.indexes ? stats.indexes.length : null}</td>
    <td className="text-right">{_.isNumber(stats.size) ? filesize(stats.size) : null}</td>
    <td>
      <CollectionSettings.Modal
        className="btn btn-warning btn-xs btn-soft pull-right" icon="fa fa-cog"
        text=" Settings" collection={collection}/>
    </td>
  </tr>
};
