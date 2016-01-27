ConfirmButton = React.createClass({

  getInitialState() {
    return {
      activated: false
    }
  },

  render() {
    const text = this.state.activated ? this.props.confirmText : this.props.text;
    const buttonProps = this.props;
    delete buttonProps.text;
    delete buttonProps.confirmText;
    return <button className={this.props.className} onClick={this.handleClick} {...buttonProps}>{text}</button>
  },

  handleClick(event) {
    event.preventDefault();

    if(!this.state.activated) {
      this.setState({activated: true});
    } else {
      this.props.onConfirm();
    }
  }

});
