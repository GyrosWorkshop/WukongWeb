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
    lineContent: '',
    lineDuration: '0',
    overflowWidth: '0'
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
    const lineDuration = (
      lineIndex < 0 ? 0 :
        lineIndex == lyrics.length - 1 ? 10 :
          lyrics[lineIndex + 1].time - lyrics[lineIndex].time
    ).toFixed(1)
    this.setState({lineContent, lineDuration})
  }

  componentDidUpdate(prevProps, prevState) {
    const {clientWidth, scrollWidth} = this.refs.line
    const overflowWidth = (clientWidth - scrollWidth).toFixed(0)
    if (overflowWidth == prevState.overflowWidth) return
    requestAnimationFrame(() => this.setState({overflowWidth}))
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
        backgroundColor: this.props.muiTheme.footer.backgroundColor,
        color: this.props.muiTheme.footer.textColor,
        fontFamily: this.props.muiTheme.fontFamily,
        opacity: 0.98
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
        animationDuration: `${this.state.lineDuration}s`,
        animationTimingFunction: 'ease',
        animationIterationCount: 'infinite'
      }
    }
  }
}
