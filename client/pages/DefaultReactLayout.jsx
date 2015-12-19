DefaultReactLayout = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let data = {};

    const connectionSlug = FlowRouter.getParam("connection");
    const databaseName = FlowRouter.getParam("database");
    const collectionName = FlowRouter.getParam("collection");
    const handle = Meteor.subscribe('layoutData', connectionSlug, databaseName, collectionName);
    if (handle.ready()) {
      const currentEnvironment = new CurrentEnvironment(); // TODO find suitable name for 'currentEnvironment'
      if(connectionSlug) {
        const connection = Connections.findOne({slug: connectionSlug});
        if(connection) {
          currentEnvironment.connection = connection;

          if(databaseName) {
            const database = Databases.findOne({connection_id: connection._id, name: databaseName});
            if(database) {
              currentEnvironment.database = database;

              if(collectionName) {
                const collection = Collections.findOne({database_id: database._id, name: collectionName});
                if(collection) {
                  currentEnvironment.collection = collection;
                } else {
                  RouterUtils.redirect(RouterUtils.pathForDatabaseDashboard(database));
                }
              }
            } else {
              RouterUtils.redirect(RouterUtils.pathForConnectionDashboard(connection));
            }
          }
        } else {
          RouterUtils.redirect('Connections');
        }
      }

      data.currentEnvironment = currentEnvironment;
    }

    return data;
  },

  render() {
    var currentEnvironment = this.data.currentEnvironment;
    if(!currentEnvironment) return <Loading />;

    // https://github.com/kadirahq/meteor-react-layout/issues/42
    const content = React.cloneElement(this.props.content, {currentEnvironment: currentEnvironment});

    const themeClass = 'db-theme-' + currentEnvironment.databaseTheme;

    return <div className={themeClass}>
      <Navigation currentEnvironment={currentEnvironment} />
      {content}
    </div>
  }


});
