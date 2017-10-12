import React from 'react';
import {mount} from 'react-mounter';

FlowRouter.route('/', {
  name: 'Connections',
  action(params) {
    mount(SimpleLayout, {content: <ConnectionsPage />});
  }
});

FlowRouter.route('/_theme_', {
  name: 'Theme',
  action(params) {
    mount(SimpleLayout, { content: <ThemePage /> });
  }
});

FlowRouter.route('/:connection', {
  name: 'ConnectionDashboard',
  action(params) {
    mount(SimpleLayout, {content: <ConnectionDashboardPage {...params} />});
  }
});

FlowRouter.route('/:connection/:database', {
  name: 'DatabaseDashboard',
  action(params) {
    mount(DefaultLayout, {content: <DatabaseDashboardPage {...params} />});
  }
});

FlowRouter.route('/:connection/:database/:collection/:filter?', {
  name: 'Documents',
  action(params, queryParams) {
    params = _.extend(params, queryParams);
    mount(DefaultLayout, {content: <DocumentsPage {...params} />});
  }
});
