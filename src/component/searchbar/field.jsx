import React, {Component, PropTypes} from 'react'
import Radium from 'radium'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import ClearIcon from 'material-ui/svg-icons/content/clear'
import muiThemeable from 'material-ui/styles/muiThemeable'

const PaperRadium = Radium(Paper)

@muiThemeable()
export default class Field extends Component {
  static propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    muiTheme: PropTypes.object.isRequired
  }

  state = {
    value: ''
  }

  setValue(value) {
    this.setState({value})
    this.props.onChange(value)
  }

  onChange = (event) => {
    this.setValue(event.target.value)
  }

  onClear = (event) => {
    this.setValue('')
  }

  onKeyDown = (event) => {
    if (event.key == 'Escape') {
      this.setValue('')
    }
  }

  render() {
    const style = this.generateStyle()
    return (
      <PaperRadium style={style.container}>
        <TextField
          hintText={this.props.name}
          value={this.state.value}
          fullWidth={true}
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
      </PaperRadium>
    )
  }

  generateStyle() {
    return {
      container: {
        position: 'relative',
        width: 'auto',
        marginLeft: this.props.muiTheme.appBar.padding,
        marginRight: this.props.muiTheme.appBar.padding,
        marginTop: this.props.muiTheme.spacing.desktopGutterMini,
        marginBottom: this.props.muiTheme.spacing.desktopGutterMini,
        paddingLeft: '1em',
        paddingRight: '1em',
        paddingTop: 0,
        paddingBottom: 0,
        [this.props.muiTheme.responsive.tablet.mediaQuery]: {
          width: this.props.muiTheme.searchField.recommendedWidth,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: this.props.muiTheme.spacing.desktopGutterLess,
          marginBottom: this.props.muiTheme.spacing.desktopGutterLess
        }
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
