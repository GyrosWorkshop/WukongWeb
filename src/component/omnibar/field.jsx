import React, {Component, PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import ClearIcon from 'material-ui/svg-icons/content/clear'

export default class Field extends Component {
  static propTypes = {
    name: PropTypes.string,
    needsConfirmation: PropTypes.bool,
    onChange: PropTypes.func
  }

  state = {
    value: ''
  }

  setValue(value, emitCallback) {
    this.setState({value})
    if (emitCallback) this.props.onChange(value)
  }

  onChange = (event) => {
    this.setValue(event.currentTarget.value, !this.props.needsConfirmation)
  }

  onClear = (event) => {
    this.setValue('', true)
  }

  onKeyDown = (event) => {
    switch (event.key) {
      case 'Escape':
        this.setValue('', true)
        break
      case 'Enter':
        this.setValue(this.state.value, true)
        break
    }
  }

  render() {
    const style = this.generateStyle()
    return (
      <div style={style.container}>
        <TextField
          style={style.field}
          hintText={this.props.name}
          value={this.state.value}
          underlineShow={false}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
        <IconButton
          style={style.button}
          onTouchTap={this.onClear}
        >
          <ClearIcon />
        </IconButton>
      </div>
    )
  }

  generateStyle() {
    return {
      container: {
        width: '100%',
        height: '100%',
        position: 'relative'
      },
      field: {
        display: 'block',
        width: 'auto',
        marginLeft: '1em',
        marginRight: 48
      },
      button: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        opacity: this.state.value ? 1 : 0,
        visibility: this.state.value ? 'visible' : 'hidden'
      }
    }
  }
}
