import React, {Component, PropTypes, cloneElement} from 'react'
import EventListener from 'react-event-listener'
import {Style} from 'radium'
import muiThemeable from 'material-ui/styles/muiThemeable'

@muiThemeable()
export default class Frame extends Component {
  static propTypes = {
    children: PropTypes.node,
    header: PropTypes.node.isRequired,
    footer: PropTypes.node.isRequired,
    muiTheme: PropTypes.object.isRequired
  }

  state = {
    headerHeight: this.props.muiTheme.appBar.maxHeight
  }

  onWindowScroll = (event) => {
    const {minHeight, maxHeight} = this.props.muiTheme.appBar
    const shrink = event.currentTarget.scrollY
    const headerHeight = Math.max(minHeight, maxHeight - shrink)
    this.setState({headerHeight})
  }

  render() {
    const style = this.generateStyle()
    return (
      <div>
        <EventListener target={window} onScroll={this.onWindowScroll} />
        <div style={style.header}>
          {cloneElement(this.props.header, {
            height: this.state.headerHeight
          })}
        </div>
        <div style={style.content}>
          {this.props.children}
        </div>
        <div style={style.footer}>
          {cloneElement(this.props.footer, {
            height: this.props.muiTheme.footer.height
          })}
        </div>
        <Style rules={{
          body: {
            backgroundColor: this.props.muiTheme.palette.canvasColor
          }
        }}/>
      </div>
    )
  }

  generateStyle() {
    return {
      header: {
        position: 'fixed',
        width: '100%',
        height: this.state.headerHeight,
        zIndex: this.props.muiTheme.zIndex.appBar
      },
      content: {
        paddingTop: this.props.muiTheme.appBar.maxHeight,
        paddingBottom: this.props.muiTheme.footer.height
      },
      footer: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        height: this.props.muiTheme.footer.height,
        zIndex: this.props.muiTheme.zIndex.appBar
      }
    }
  }
}
