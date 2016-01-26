SettingsBox = React.createClass({

  getInitialState: function() {
    this.currentSettings = new CurrentSettings();
    return {settings: this.currentSettings.global};
  },

  render() {
    return (
        <div className="row p-t">
          <div className="col-sm-8 col-sm-push-2 col-md-6 col-md-push-3 col-lg-4 col-lg-push-4">
            <div className="list box-shadow-3">
              <div className="list-item text-center">
                <i className="fa fa-cog m-r" />
                Global Settings
              </div>
              <div className="list-item text-center">
                <input type="checkbox" value="1" name="open-first-document" id="open-first-document" checked={this.state.settings.openFirstDocument} onChange={this.handleOpenFirstDocument} className="m-r"/> Automatically expand first document
              </div>
              <div className="list-item text-center">
                Number of documents per page:
                <input type="text" value={this.state.settings.documentsPerPage} name="documents-per-page" id="documents-per-page" onChange={this.handleDocumentsPerPage} className="m-l"/> 
              </div>
            </div>
          </div>
        </div>
    );
  },

  handleOpenFirstDocument(event) {
    let status = $(event.currentTarget).is(':checked');

    this.currentSettings.setGlobal('openFirstDocument', status);

    let currentState = this.state;
    currentState.settings.openFirstDocument = status;
    this.setState(currentState);
  }, 

  handleDocumentsPerPage(event) {
    let status = $(event.currentTarget).val();

    this.currentSettings.setGlobal('documentsPerPage', parseInt(status));

    let currentState = this.state;
    currentState.settings.documentsPerPage = parseInt(status);
    this.setState(currentState);
  }

});
