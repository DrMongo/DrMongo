FlowRouter.route('/', {
  name: 'Connections',
  action(params) {
    ReactLayout.render(SimpleLayout, {content: <ConnectionsPage />});
  }
});

FlowRouter.route('/_theme_', {
  name: 'Theme',
  action(params) {
    ReactLayout.render(SimpleLayout, { content: <ThemePage /> });
  }
});

FlowRouter.route('/:connection', {
  name: 'ConnectionDashboard',
  action(params) {
    ReactLayout.render(SimpleLayout, {content: <ConnectionDashboardPage {...params} />});
  }
});

FlowRouter.route('/:connection/:database', {
  name: 'DatabaseDashboard',
  action(params) {
    ReactLayout.render(DefaultLayout, {content: <DatabaseDashboardPage {...params} />});
  }
});

FlowRouter.route('/:connection/:database/:collection/:filter?', {
  name: 'Documents',
  action(params, queryParams) {
    params = _.extend(params, queryParams);
    ReactLayout.render(DefaultLayout, {content: <DocumentsPage {...params} />});
  }
});
