import React, {Component, PropTypes} from 'react'
import Radium from 'radium'
import muiThemeable from 'material-ui/styles/muiThemeable'

import Item from './item'

@muiThemeable()
@Radium
export default class List extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    muiTheme: PropTypes.object.isRequired
  }

  render() {
    const style = this.generateStyle()
    return (
      <div style={style.list}>
        {this.props.items.map(item => <Item {...item} />)}
      </div>
    )
  }

  generateStyle() {
    return {
      list: {
        boxSizing: 'border-box',
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        marginLeft: 0,
        marginRight: 0,
        marginTop: -this.props.muiTheme.spacing.desktopGutterMini,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: this.props.muiTheme.spacing.desktopGutterMini,
        paddingLeft: this.props.muiTheme.spacing.desktopGutterMini,
        paddingRight: this.props.muiTheme.spacing.desktopGutterMini,
        [this.props.muiTheme.responsive.tablet.mediaQuery]: {
          width: 'auto',
          marginLeft: '10%',
          marginRight: '10%'
        },
        [this.props.muiTheme.responsive.desktop.mediaQuery]: {
          width: this.props.muiTheme.responsive.desktop.breakpoint * 0.8,
          marginLeft: 'auto',
          marginRight: 'auto'
        }
      }
    }
  }
}
