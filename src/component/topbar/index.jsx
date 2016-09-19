import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Radium from 'radium'
import Paper from 'material-ui/Paper'
import muiThemeable from 'material-ui/styles/muiThemeable'

import Heading from './heading'
import Status from '../status'
import Player from '../player'
import Profile from '../profile'
import Action from '../../action'

const PaperRadium = Radium(Paper)

function mapStateToProps(state) {
  return {
    avatar: state.user.avatar,
    playing: state.song.playing
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onPlaylistSync() {
      dispatch(Action.User.sync.create())
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@muiThemeable()
export default class TopBar extends Component {
  static propTypes = {
    avatar: PropTypes.string,
    playing: PropTypes.object,
    height: PropTypes.number.isRequired,
    onPlaylistSync: PropTypes.func,
    muiTheme: PropTypes.object.isRequired
  }

  state = {
    profile: false
  }

  getPlayingString() {
    const {title, artist, album} = this.props.playing
    return title ? `${title} - ${artist} - ${album}` : ''
  }

  getStatusHeight() {
    const {minHeight, maxHeight, padding} = this.props.muiTheme.appBar
    return maxHeight - minHeight - padding
  }

  getExpandProgress() {
    const {minHeight, maxHeight} = this.props.muiTheme.appBar
    const {height} = this.props
    return (height - minHeight) / (maxHeight - minHeight)
  }

  onProfileOpen = (event) => {
    this.setState({profile: true})
  }

  onProfileClose = (reason) => {
    this.setState({profile: false})
  }

  onPlaylistSync = (event) => {
    this.props.onPlaylistSync()
  }

  render() {
    const expandProgress = this.getExpandProgress()
    const style = this.generateStyle()
    return (
      <PaperRadium
        style={style.topbar}
        rounded={false}
        zDepth={expandProgress == 1 ? 0 : 2}
      >
        <div style={style.content}>
          <Heading
            titleText='Wukong'
            subtitleText={this.getPlayingString()}
            subtitleOpacity={1 - expandProgress}
            avatarImage={this.props.avatar}
            height={this.props.muiTheme.appBar.minHeight}
            actions={[{
              key: 'profile',
              title: 'Profile',
              callback: this.onProfileOpen
            }, {
              key: 'sync',
              title: 'Sync',
              callback: this.onPlaylistSync
            }]}
          >
            <Player />
          </Heading>
          <Status height={this.getStatusHeight()} />
        </div>
        <Profile
          openManually={this.state.profile}
          onRequestClose={this.onProfileClose}
        />
      </PaperRadium>
    )
  }

  generateStyle() {
    return {
      topbar: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        margin: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: this.props.muiTheme.appBar.padding,
        paddingRight: this.props.muiTheme.appBar.padding,
        backgroundColor: this.props.muiTheme.appBar.color,
        color: this.props.muiTheme.appBar.textColor,
        [this.props.muiTheme.responsive.tablet.mediaQuery]: {
          paddingLeft: 0,
          paddingRight: 0
        }
      },
      content: {
        width: '100%',
        margin: 0,
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
