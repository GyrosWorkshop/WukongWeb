import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import Popover from 'material-ui/Popover'
import { List, ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import StarIcon from 'material-ui/svg-icons/toggle/star'
import PlayArrowIcon from 'material-ui/svg-icons/av/play-arrow'
import MusicVideoIcon from 'material-ui/svg-icons/av/music-video'
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download'
import * as Quality from '../../api/codec/quality'
import muiThemeable from 'material-ui/styles/muiThemeable'

import artworkImage from '../../resource/artwork.png'

function mapStateToProps(state) {
  return {
    user: state.user,
    members: state.channel.members,
    playing: state.song.playing,
    connection: state.user.connection,
    quality: state.user.audioQuality
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@muiThemeable()
export default class Status extends Component {
  static propTypes = {
    user: PropTypes.object,
    members: PropTypes.arrayOf(PropTypes.object),
    playing: PropTypes.object,
    connection: PropTypes.number,
    quality: PropTypes.number,
    height: PropTypes.number.isRequired,
    muiTheme: PropTypes.object.isRequired
  }

  state = {
    popover: false,
    popoverAnchor: null,
    download: false
  }

  getPlayerNickname() {
    const player = (this.props.members || []).find(member =>
      member.id == this.props.playing.player) || {}
    return player.nickname
  }

  getAudio() {
    const {files} = this.props.playing
    const file = files.filter(it => it[2] <= this.props.quality)
        .sort((a, b) => b[2] - a[2])[0]
      || files.sort((a, b) => a[2] - b[2])[0]
    return file
  }

  getAvailBestAudio() {
    const {files} = this.props.playing
    const file = files.sort((a, b) => b[2] - a[2])[0]
    return file
  }

  getFileName() {
    return this.props.playing.title + ' - ' + this.props.playing.artist
  }

  getFileUrl() {
    const {files} = this.props.playing
    return files.sort((a, b) => b[4] - a[4])[0][0]
  }

  onPopoverOpen = (event) => {
    event.preventDefault()
    this.setState({popover: true, popoverAnchor: event.currentTarget})
  }

  onPopoverClose = (event) => {
    this.setState({popover: false, popoverAnchor: null})
  }

  onDoubleClick = () => {
    this.setState({download: true})
  }

  render() {
    const style = this.generateStyle()
    return (
      <div style={style.container}>
        <Paper style={style.image} onDoubleClick={this.onDoubleClick}/>
        <div style={style.textContainer}>
          <div style={style.playerText}>
            <span
              style={style.actionText}
              onTouchTap={this.onPopoverOpen}
            >
              {this.getPlayerNickname()}@{this.props.user.channel}
            </span>
          </div>
          <div style={style.titleText} title={this.props.playing.title}>
            <a
              style={style.actionText}
              href={this.props.playing.url}
              target='_blank'
            >
              {this.props.playing.title}
            </a>
            {
              this.props.playing.mvUrl
                ? <a
                  style={style.actionText}
                  href={this.props.playing.mvUrl}
                  target='_blank'
                >
                  <MusicVideoIcon
                    color={this.props.muiTheme.appBar.textColor}
                    style={style.actionIcon}
                  />
                </a>
                : null
            }
            {
              this.state.download
                ? <a
                  style={style.actionText}
                  href={this.getFileUrl()}
                  download={this.getFileName()}
                  type='audio/flac'
                  target='_blank'
                >
                  <FileDownloadIcon
                    color={this.props.muiTheme.appBar.textColor}
                    style={style.actionIcon}
                  />
                </a>
                : null
            }
          </div>
          <div style={style.otherText} title={this.props.playing.album}>
            <span>{this.props.playing.album}</span>
          </div>
          <div style={style.otherText} title={this.props.playing.artist}>
            <span>{this.props.playing.artist}</span>
          </div>
          {
            this.props.playing.files
              ? <div style={style.remarkText}>
                  <span>
                    Audio Quality:
                    {' ' + Quality.encode(this.getAudio()[2])}
                    {' '}({this.getAudio()[4] / 1000}kbps,
                    {' ' + this.getAudio()[3]} format).
                    {
                      this.getAvailBestAudio() != this.getAudio()
                        ? ' Alternative: ' +
                        Quality.encode(this.getAvailBestAudio()[2])
                        : null
                    }
                  </span>
              </div>
              : null
          }
        </div>
        <Popover
          open={this.state.popover}
          anchorEl={this.state.popoverAnchor}
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.onPopoverClose}
        >
          <List>
            {(this.props.members || []).map(member => (
              <ListItem
                innerDivStyle={style.memberItem}
                key={member.id}
                primaryText={member.nickname}
                leftAvatar={
                  <Avatar
                    src={member.avatar}
                    size={30}
                    style={style.memberAvatar}
                  />
                }
                rightIcon={
                  member.id == this.props.playing.player
                    ? <PlayArrowIcon style={style.memberIcon}/>
                    : member.id == this.props.user.id
                      ? <StarIcon style={style.memberIcon}/>
                      : null
                }
                onTouchTap={this.onPopoverClose}
              />
            ))}
          </List>
        </Popover>
      </div>
    )
  }

  generateStyle() {
    return {
      container: {
        display: 'flex',
        width: '100%',
        height: this.props.height
      },
      image: {
        width: this.props.height,
        height: this.props.height,
        backgroundImage: `url(${(
          this.props.playing.artwork &&
          this.props.playing.artwork[this.props.connection]
        ) || artworkImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      },
      textContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: this.props.height,
        marginLeft: '1em',
        fontSize: this.props.muiTheme.appBar.bodyFontSize,
        fontWeight: this.props.muiTheme.appBar.bodyFontWeight,
        overflow: 'hidden'
      },
      playerText: {
        marginBottom: '0.5em',
      },
      titleText: {
        fontSize: '1.2em',
        fontWeight: 400
      },
      otherText: {
        marginTop: '0.5em'
      },
      remarkText: {
        marginTop: '1em',
        fontSize: '0.8em'
      },
      actionText: {
        color: 'inherit',
        textDecoration: 'inherit',
        cursor: 'pointer',
        marginRight: 6
      },
      actionIcon: {
        verticalAlign: '-0.2em'
      },
      memberItem: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 54,
        paddingRight: 54
      },
      memberAvatar: {
        top: 5
      },
      memberIcon: {
        height: 20,
        width: 20,
        margin: 5,
        top: 5,
        right: 12
      }
    }
  }
}
