import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Radium from 'radium'
import muiThemeable from 'material-ui/styles/muiThemeable'

function mapStateToProps(state) {
  return {
    lyrics: state.song.playing.lyrics,
    elapsed: state.song.status.elapsed
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@muiThemeable()
@Radium
export default class Lyrics extends Component {
  static propTypes = {
    lyrics: PropTypes.array,
    elapsed: PropTypes.number,
    height: PropTypes.number.isRequired,
    muiTheme: PropTypes.object.isRequired
  }

  getLyricsLine() {
    const {lyrics, elapsed} = this.props
    if (lyrics) {
      return lyrics.find((line, index) => {
        const nextLine = lyrics[index + 1]
        return nextLine
          ? line.time <= elapsed && elapsed < nextLine.time
          : true
      }).text
    } else {
      return '没有歌词 o(*≧▽≦)ツ'
    }
  }

  render() {
    const style = this.generateStyle()
    return (
      <div style={style.footer}>
        <div style={style.content}>
          {this.getLyricsLine()}
        </div>
      </div>
    )
  }

  generateStyle() {
    return {
      footer: {
        width: '100%',
        height: '100%',
        background: this.props.muiTheme.footer.backgroundColor,
        color: this.props.muiTheme.footer.textColor,
        fontFamily: this.props.muiTheme.fontFamily
      },
      content: {
        width: '100%',
        height: '100%',
        fontSize: '1.2em',
        lineHeight: `${this.props.height}px`,
        textAlign: 'center',
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
