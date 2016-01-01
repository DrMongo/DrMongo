MyInput = React.createClass({

  // Add the Formsy Mixin
  mixins: [Formsy.Mixin],

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  changeValue(event) {
    this.setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']);
  },

  render() {

    let props = this.props;
    props.type = props.type || 'text';

    return (
      <input
        {...props}
        onChange={this.changeValue}
        value={this.getValue()}
        checked={this.props.type === 'checkbox' && this.getValue() ? 'checked' : null}
      />
    );
  }
});
