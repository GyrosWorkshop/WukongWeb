import React, {Component, PropTypes} from 'react'
import Radium from 'radium'
import Paper from 'material-ui/Paper'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import muiThemeable from 'material-ui/styles/muiThemeable'

@muiThemeable()
@Radium
export default class Item extends Component {
  static propTypes = {
    image: PropTypes.string,
    text: PropTypes.string,
    detail: PropTypes.string,
    extra: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.object),
    muiTheme: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.image != nextProps.image
      || this.props.text != nextProps.text
      || this.props.detail != nextProps.detail
      || this.props.extra != nextProps.extra
      || this.props.actions != nextProps.actions
  }

  render() {
    const style = this.generateStyle()
    return (
      <Paper style={style.item}>
        <div style={style.topOverlay}>
          <div style={style.textContainer}>
            <div style={style.extraLabel}>{this.props.extra}</div>
          </div>
        </div>
        <div style={style.bottomOverlay}>
          <div style={style.textContainer}>
            <div
              style={style.textLabel}
              title={this.props.text}
            >
              {this.props.text}
            </div>
            <div
              style={style.detailLabel}
              title={this.props.detail}
            >
              {this.props.detail}
            </div>
          </div>
          <div>
            <IconMenu
              iconButtonElement={
                <IconButton
                  touchRippleColor={this.props.muiTheme.gridTile.textColor}
                >
                  <MoreVertIcon
                    color={this.props.muiTheme.gridTile.textColor}
                  />
                </IconButton>
              }
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              {(this.props.actions || []).map(action => (
                <MenuItem
                  key={action.key}
                  primaryText={action.title}
                  leftIcon={action.icon}
                  onTouchTap={action.callback}
                />
              ))}
            </IconMenu>
          </div>
        </div>
      </Paper>
    )
  }

  generateStyle() {
    return {
      item: {
        width: '100%',
        height: '100%',
        backgroundImage: `url(${this.props.image || ''})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      },
      topOverlay: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: this.props.muiTheme.gridTile.overlayHeight,
        color: this.props.muiTheme.gridTile.textColor,
        background: this.props.muiTheme.gridTile.topOverlayBackground,
        transition: this.props.muiTheme.gridTile.overlayTransition,
        opacity: 0,
        ':hover': {
          opacity: 1
        }
      },
      bottomOverlay: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: this.props.muiTheme.gridTile.overlayHeight,
        color: this.props.muiTheme.gridTile.textColor,
        background: this.props.muiTheme.gridTile.bottomOverlayBackground
      },
      textContainer: {
        flex: 1,
        fontSize: this.props.muiTheme.gridTile.textSize,
        paddingLeft: '0.5em',
        overflow: 'hidden'
      },
      textLabel: {
        fontSize: '1em',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      },
      detailLabel: {
        fontSize: '0.75em',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      },
      extraLabel: {
        fontSize: '1em',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }
    }
  }
}
