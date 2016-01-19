SimpleLayout = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let data = {};

    const handle = Meteor.subscribe('layoutData', null, null, null);
    
    data.ready = handle.ready();

    return data;
  },

  render() {
    if(!this.data.ready) return <Loading />;

    return <div id="simple-layout">{this.props.content}</div>
  }

});
