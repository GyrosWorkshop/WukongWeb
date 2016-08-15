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

  state = {
    lineIndex: -1,
    lineContent: '',
    overflowWidth: '0',
    scrollDuration: '0'
  }

  componentWillReceiveProps(nextProps) {
    const {lyrics, elapsed} = this.props
    const lineIndex = lyrics ? lyrics.findIndex((line, index) => {
      const nextLine = lyrics[index + 1]
      return !nextLine || elapsed < nextLine.time
    }) : -1
    const lineContent = lineIndex >= 0
      ? lyrics[lineIndex].text
      : '没有歌词 o(*≧▽≦)ツ'
    this.setState({lineIndex, lineContent})
  }

  componentDidUpdate(prevProps, prevState) {
    const {refs: {line}, props: {lyrics}, state: {lineIndex}} = this
    const overflowWidth = (
      line.clientWidth - line.scrollWidth
    ).toFixed(0)
    const scrollDuration = (
      lineIndex < 0 ? 0 :
        lineIndex < lyrics.length - 1
          ? lyrics[lineIndex + 1].time - lyrics[lineIndex].time
          : 10
    ).toFixed(1)
    if (overflowWidth == prevState.overflowWidth &&
        scrollDuration == prevState.scrollDuration) {
      return
    }
    setTimeout(() => this.setState({overflowWidth, scrollDuration}), 0)
  }

  render() {
    const style = this.generateStyle()
    return (
      <div style={style.lyrics}>
        <div style={style.content} ref='line'>
          {this.state.lineContent}
        </div>
      </div>
    )
  }

  generateStyle() {
    return {
      lyrics: {
        width: '100%',
        height: '100%',
        boxShadow: this.props.muiTheme.footer.boxShadow,
        background: this.props.muiTheme.footer.backgroundColor,
        color: this.props.muiTheme.footer.textColor,
        fontFamily: this.props.muiTheme.fontFamily
      },
      content: {
        marginLeft: '1em',
        marginRight: '1em',
        fontSize: '1.2em',
        lineHeight: `${this.props.height}px`,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        animationName: Radium.keyframes({
          '0%': {transform: 'translate(0, 0)'},
          '100%': {transform: `translate(${this.state.overflowWidth}px, 0)`},
        }, 'marquee'),
        animationDuration: `${this.state.scrollDuration}s`,
        animationTimingFunction: 'ease',
        animationIterationCount: 'infinite'
      }
    }
  }
}
