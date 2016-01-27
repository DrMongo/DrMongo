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


MySelect = React.createClass({
  mixins: [Formsy.Mixin],

  changeValue(event) {
    const value = event.currentTarget.value;
    this.setValue(value);
    if(this.props.onChange) {
      this.props.onChange(value);
    }
  },

  render() {
    const className = 'form-group' + (this.props.className || ' ') +
      (this.showRequired() ? 'required' : this.showError() ? 'error' : '');
    const errorMessage = this.getErrorMessage();

    const options = this.props.options.map((option, i) => (
      <option key={i} value={option.value}>
        {option.title}
      </option>
    ));

    return (
      <div className={className}>
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <select className="form-control" name={this.props.name} onChange={this.changeValue} value={this.getValue()}>
          {options}
        </select>
        <span className='validation-error'>{errorMessage}</span>
      </div>
    );
  }

});
