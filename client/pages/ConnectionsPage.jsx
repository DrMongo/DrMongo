import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

ConnectionsPage = withTracker(props => {
  return {
    connections: Connections.find({}, {sort: {name: 1}}).fetch()
  }
})(
  React.createClass({

    render() {
      return <div id="connection-page">
        <div className="container">
          <div className="m-t-lg m-b text-center color-white">
            <h1><i className="fa fa-heartbeat" /> Dr. Mongo</h1>
          </div>
          <div className="row p-t">
            <div className="col-sm-8 col-sm-push-2 col-md-6 col-md-push-3 col-lg-4 col-lg-push-4">
              <NewVersionMessage />
              <div className="list box-shadow-3">
                {this.props.connections ? this.renderConnections() : <Loading />}
                <AddConnectionBlock />
              </div>
              <div className="m-t text-right">
                <EditGlobalSettings.Modal className="color-white" icon="fa fa-cogs" />
              </div>
            </div>
          </div>
        </div>
      </div>
    },

    renderConnections() {
      return this.props.connections.map((item) => {
        return <ConnectionBlock key={item._id} connection={item} />
      })
    }
  })
);

NewVersionMessage = withTracker(props => {
  return {
    version: DrmVersion.findDocument()
  }
})(React.createClass({

  render() {
    if(this.props.version && this.props.version.newVersionAvailable) {
      return (
        <div className="alert alert-warning box-shadow-4">
          <div>Dr. Mongo is <strong>deprecated</strong></div>
          <span>Please visit our new desktop app </span>
          <a href="http://www.drmingo.com/" target="_blank">Dr. Mingo</a>
        </div>
      );
    } else {
      return null;
    }
  }
}));


ConnectionBlock = ({connection}) => {
  const editProps = {
    connection: connection
  };

  return <div className="list-item">
    <i className={connection.getIcon()} />
    <a className="m-l" href={RouterUtils.pathForDefaultDatabase(connection)}>{connection.name}</a>
    <EditConnection.Modal className="small pull-right" icon="fa fa-pencil" editProps={editProps} />
  </div>
};

AddConnectionBlock = React.createClass({

  render() {
    const editProps = {
      onSave: this.handleSave
    };

    return <div className="list-item">
      <EditConnection.Modal text="Add new connection" editProps={editProps} />
    </div>
  },

  handleSave(connectionId) {
    const connection = Connections.findOne(connectionId);

    RouterUtils.redirect(RouterUtils.pathForDefaultDatabase(connection));
  }

});
