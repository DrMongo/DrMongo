import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

const Layout = ({leading, content}) => {
  if(leading) return <Loading />;

  return <div id="simple-layout">{content}</div>
};


SimpleLayout = withTracker(props => {
  const handle = Meteor.subscribe('layoutData', null, null, null);

  return {
    loading: !handle.ready()
  }
})(Layout);

