import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';


Navigation = withTracker(props => {
  let data = {};

  const env = props.currentEnvironment;
  const handle = Meteor.subscribe('navigationData', env.connectionId, env.databaseId);
  if (handle.ready()) {
    data.connections = Connections.find({}, {sort: {name: 1}}).fetch();

    if(env.connectionId) {
      data.databases = env.connection.databases();

      if(env.databaseId) {
        data.collections = env.database.collections();
      }
    }

    data.ready = true;
  }

  return data;
})(React.createClass({


  componentDidMount() {
    this.setState({searching: false});
  },

  render() {
    return <div className="navbar navbar-default my-navbar db-theme">
      {this.props.ready ? this.renderNavigation() : <Loading />}
    </div>
  },

  renderNavigation() {
    const env = this.props.currentEnvironment;
    const selectedDatabase = env.databaseId ? env.database.name : 'Select database';
    const selectedCollection = env.collectionId ? env.collection.name : 'Select collection';

    return <div className="container">
      <div className="navbar-header">
        <button type="button" className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#bs-example-navbar-collapse-1"
                aria-expanded="false">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
        <Navigation.Logo />
      </div>
      <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul className="nav navbar-nav">
          {env.connectionId ? <NavigationConnectionsDropdown selected={env.connection.name} items={this.props.connections} /> : null}
          {this.props.databases ? <NavigationDatabasesDropdown selected={selectedDatabase} items={this.props.databases} /> : null}
          {this.props.collections ? <NavigationCollectionsDropdown selected={selectedCollection} items={this.props.collections} env={this.props.currentEnvironment} /> : null}
        </ul>

        {env.databaseId ? this.renderSearchForm() : null}
      </div>
    </div>
  },

  renderSearchForm() {
    return <Formsy.Form className="navbar-form navbar-right db-theme-form" onSubmit={this.handleSearchSubmit}>
      <div className="form-group">
        {this.state.searching ? <i className="fa fa-spinner fa-spin"></i> : ''}&nbsp;
        <MyInput className="form-control" name="text" type="text" placeholder="Search by _id" autoComplete="off" />
      </div>
      <button className="btn btn-default hidden" type="submit">Submit</button>
    </Formsy.Form>
  },

  handleSearchSubmit(values) {
    if (!resemblesId(values.text)) {
      sAlert.warning('Not an ID.');
      return false;
    }

    const databaseId = this.props.currentEnvironment.databaseId;

    this.setState({searching: true});
    Meteor.call('findCollectionForDocumentId', databaseId, values.text, (error, result) => {
      if (result === null) {
        sAlert.warning('Document not found.');
      } else {
        let c = Collections.findOne({database_id: databaseId, name: result});
        if (c) {
          const filterId = FilterHistory.insert({
            createdAt: new Date(),
            collection_id: c._id,
            name: null,
            filter: values.text
          });

          RouterUtils.redirect(RouterUtils.pathForDocuments(c, filterId))
        }
      }
      this.setState({searching: false});
    });
  }
}));


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------


Navigation.Logo = withTracker(props => {
  let data = {};

  data.version = DrmVersion.findDocument();

  return data;

})(React.createClass({

  render() {
    let newVersion;
    if(this.props.version && this.props.version.newVersionAvailable) {
      newVersion = <span className="new-version-available" />
    }

    return (
      <a className="navbar-brand" href="/" title="Home / Connections">
        <i className="fa fa-heartbeat" /> Dr. Mongo{newVersion}
      </a>
    )
  }
}));


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

NavigationConnectionsDropdown = ({selected, items}) => (
  <li className="dropdown">
    <a href="#" className="dropdown-toggle" data-toggle="dropdown"
       role="button" aria-haspopup="true"
       aria-expanded="false" title="Select connection">
      {selected}
      <span className="caret" />
    </a>
    <ul className="dropdown-menu">
      {items.map((item) => (
        <li key={item._id}><a href={RouterUtils.pathForConnectionDashboard(item)}>{item.name}</a></li>
      ))}
    </ul>
  </li>
);

NavigationDatabasesDropdown = ({selected, items}) => (
  <li className="dropdown">
    <a href="#" className="dropdown-toggle" data-toggle="dropdown"
       role="button" aria-haspopup="true"
       aria-expanded="false" title="Select database">
      {selected}
      <span className="caret" />
    </a>
    <ul className="dropdown-menu db-theme-shadow-box">
      {items.map((item) => {
        const dbTheme = 'db-theme-' + item.getTheme() + ' db-theme-inverted';
        return <li key={item._id}>
          <a className={dbTheme} href={RouterUtils.pathForDatabaseDashboard(item)}>{item.name}</a>
        </li>
      })}
    </ul>
  </li>
);


NavigationCollectionsDropdown = React.createClass({

  render() {
    return <li className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown"
           role="button" aria-haspopup="true"
           aria-expanded="false" title="Select collection">
          {this.props.selected}
          <span className="caret" />
        </a>
        <ul className="dropdown-menu collection-dropdown">

          {this.props.items.map((collection) => {
            // const collectionIcon = collection.icon() + ' after';

            var savedFilters = FilterHistory.find({name: {$ne: null}, collection_id: collection._id}).fetch();

            if (savedFilters.length > 0) {
              var submenu = <ul className="dropdown-menu">
                    {savedFilters.map((filterItem, index) => {
                      return <li className="menu-item" key={index}><a href={RouterUtils.pathForDocuments(collection, filterItem._id)}>{filterItem.name}</a></li>
                    })}
                  </ul>
            } else {
              var submenu = null;
            }

            return <li key={collection._id} className={submenu ? 'menu-item dropdown dropdown-submenu' : 'menu-item dropdown'}>
                  <a href={RouterUtils.pathForDocuments(collection)} className={submenu ? 'dropdown-toggle' : ''} data-toggle={submenu ? 'dropdown' : ''} onClick={(event) => {FlowRouter.go(RouterUtils.pathForDocuments(collection)); return false;}}>
                  <div className="relative text-nowrap z1">{collection.name}</div>
                  </a>
                  {submenu}
            </li>
          })}

          <li className="divider" />
          <li><a href="#" onClick={this.handleCreateCollection}><i className="fa fa-plus" /> Create collection</a></li>
        </ul>
      </li>
  },

  handleCreateCollection(event) {
    event.preventDefault();

    var collectionName = prompt("Please enter collection name", "");

    if (collectionName != null) {
      const database = this.props.env.database;
      Meteor.call('createCollection', database._id, collectionName, (error , response) => {
        if(error) {
          log(error);
          sAlert.error('Oh snap!');
        } else {
          const data = {
            collection: collectionName,
            database: database.name,
            connection: database.connection().slug,
            filter: null,
            page: null
          };

          FlowRouter.go('Documents', data);
        }
      });
    }

  }
});
