import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Paper from 'material-ui/Paper'
import Popover from 'material-ui/Popover'
import {List, ListItem} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import StarIcon from 'material-ui/svg-icons/toggle/star'
import PlayArrowIcon from 'material-ui/svg-icons/av/play-arrow'
import muiThemeable from 'material-ui/styles/muiThemeable'

import Codec from '../../api/codec'
import artworkImage from '../../resource/artwork.png'

function mapStateToProps(state) {
  return {
    user: state.user,
    members: state.channel.members,
    playing: state.song.playing,
    useCdn: state.user.useCdn
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
    useCdn: PropTypes.bool,
    height: PropTypes.number.isRequired,
    muiTheme: PropTypes.object.isRequired
  }

  state = {
    popover: false,
    popoverAnchor: null
  }

  getPlayerNickname() {
    const player = (this.props.members || []).find(member =>
      member.id == this.props.playing.player) || {}
    return player.nickname
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
      <div style={style.container}>
        <Paper style={style.image} />
        <div style={style.textContainer}>
          <div
            style={style.playerText}
            onTouchTap={this.onPopoverOpen}
          >
            {this.getPlayerNickname()}@{this.props.user.channel}
          </div>
          <div
            style={style.titleText}
            title={this.props.playing.title}
          >
            {this.props.playing.title}
          </div>
          <div
            style={style.otherText}
            title={this.props.playing.album}
          >
            {this.props.playing.album}
          </div>
          <div
            style={style.otherText}
            title={this.props.playing.artist}
          >
            {this.props.playing.artist}
          </div>
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
                    ? <PlayArrowIcon style={style.memberIcon} />
                    : member.id == this.props.user.id
                      ? <StarIcon style={style.memberIcon} />
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
        backgroundImage: `url(${
          Codec.File.decode(this.props.playing.artwork, this.props.useCdn)
          || artworkImage})`,
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
        cursor: 'pointer'
      },
      titleText: {
        fontSize: '1.2em',
        fontWeight: 400
      },
      otherText: {
        marginTop: '0.5em'
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
