import React from 'react';

ThemePage = React.createClass({
  render() {
    return <div className="container">
      <div className="bg-box m-t-sm p-a">
        <div>
          <button className="btn btn-default">Default</button>
          <button className="btn btn-default btn-inverted">btn-inverted</button>
          <button className="btn btn-default btn-soft">btn-soft</button>
        </div>
        <div className="m-t-md">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-primary btn-inverted">btn-inverted</button>
          <button className="btn btn-primary btn-soft">btn-soft</button>
        </div>
        <div className="m-t-md">
          <button className="btn btn-success">Success</button>
          <button className="btn btn-success btn-inverted">btn-inverted</button>
          <button className="btn btn-success btn-soft">btn-soft</button>
        </div>
        <div className="m-t-md">
          <button className="btn btn-warning">Warning</button>
          <button className="btn btn-warning btn-inverted">btn-inverted</button>
          <button className="btn btn-warning btn-soft">btn-soft</button>
        </div>
        <div className="m-t-md">
          <button className="btn btn-danger">Danger</button>
          <button className="btn btn-danger btn-inverted">btn-inverted</button>
          <button className="btn btn-danger btn-soft">btn-soft</button>
        </div>
        <div className="m-t-md">
          <button className="btn btn-info">Info</button>
          <button className="btn btn-info btn-inverted">btn-inverted</button>
          <button className="btn btn-info btn-soft">btn-soft</button>
        </div>
      </div>
    </div>
  }
})
