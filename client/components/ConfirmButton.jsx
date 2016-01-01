ConfirmButton = React.createClass({

  getInitialState() {
    return {
      activated: false
    }
  },

  render() {
    const text = this.state.activated ? this.props.confirmText : this.props.text;
    return <button className={this.props.className} onClick={this.handleClick}>{text}</button>
  },

  handleClick() {
    if(!this.state.activated) {
      this.setState({activated: true});
    } else {
      this.props.onConfirm();
    }
  }

});
