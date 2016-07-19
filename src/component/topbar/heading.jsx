import React, {Component, PropTypes} from 'react'
import Radium from 'radium'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import muiThemeable from 'material-ui/styles/muiThemeable'

@muiThemeable()
@Radium
export default class Heading extends Component {
  static propTypes = {
    titleText: PropTypes.string,
    subtitleText: PropTypes.string,
    subtitleOpacity: PropTypes.number,
    avatarImage: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.node,
    height: PropTypes.number.isRequired,
    muiTheme: PropTypes.object.isRequired
  }

  state = {
    popover: false,
    popoverAnchor: null
  }

  onPopoverOpen = (event) => {
    event.preventDefault()
    this.setState({popover: true, popoverAnchor: event.currentTarget})
  }

  onPopoverClose = (event) => {
    this.setState({popover: false, popoverAnchor: null})
  }

  render() {
    const style = this.generateStyle()
    return (
      <div style={style.title}>
        <div style={style.titleLabel} >
          &#8203;{this.props.titleText}
        </div>
        <div style={style.subtitleLabel} >
          &#8203;{this.props.subtitleText}
        </div>
        <div style={style.content}>
          {this.props.children}
        </div>
        <div
          style={style.avatar}
          onTouchTap={this.onPopoverOpen}
        >
          <div style={style.avatarImage}>
            <div style={style.avatarOverlay} />
          </div>
        </div>
        <Popover
          open={this.state.popover}
          anchorEl={this.state.popoverAnchor}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.onPopoverClose}
        >
          <Menu
            onItemTouchTap={this.onPopoverClose}
          >
            {this.props.actions.map(action => (
              <MenuItem
                key={action.key}
                primaryText={action.title}
                onTouchTap={action.callback}
              />
            ))}
          </Menu>
        </Popover>
      </div>
    )
  }

  generateStyle() {
    return {
      title: {
        display: 'flex',
        alignItems: 'baseline',
        width: '100%',
        height: this.props.height,
        lineHeight: `${this.props.height}px`,
        fontSize: this.props.muiTheme.appBar.titleFontSize
      },
      titleLabel: {
        height: '100%',
        fontWeight: this.props.muiTheme.appBar.titleFontWeight,
        fontSize: '1em',
        cursor: 'default'
      },
      subtitleLabel: {
        flex: 1,
        height: '100%',
        fontWeight: this.props.muiTheme.appBar.subtitleFontWeight,
        fontSize: '0.8em',
        marginLeft: '0.5em',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        opacity: this.props.subtitleOpacity,
        visibility: this.props.subtitleOpacity ? 'visible' : 'hidden',
        cursor: 'default'
      },
      content: {
        height: '100%'
      },
      avatar: {
        height: '100%',
        cursor: 'pointer'
      },
      avatarImage: {
        display: 'inline-block',
        boxSizing: 'border-box',
        width: this.props.muiTheme.avatar.size,
        height: this.props.muiTheme.avatar.size,
        position: 'relative',
        top: (this.props.height - this.props.muiTheme.avatar.size) / 2,
        borderWidth: this.props.muiTheme.avatar.borderWidth,
        borderStyle: 'solid',
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundImage: `url(${this.props.avatarImage || ''})`,
        backgroundSize: '100%'
      },
      avatarOverlay: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: this.props.muiTheme.avatar.overlayColor,
        opacity: 0,
        ':active': {
          opacity: 0.2
        }
      }
    }
  }
}
