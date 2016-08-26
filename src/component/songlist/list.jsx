import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Radium from 'radium'
import FlipMove from 'react-flip-move'
import muiThemeable from 'material-ui/styles/muiThemeable'

import Item from './item'

@muiThemeable()
@Radium
export default class List extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    canMove: PropTypes.bool,
    onItemMove: PropTypes.func,
    muiTheme: PropTypes.object.isRequired
  }

  state = {
    gestureRunning: false,
    fromIndex: -1,
    toIndex: -1,
    offset: [0, 0],
    position: [0, 0]
  }

  sortedItems() {
    const items = this.props.items.slice()
    const item = items.splice(this.state.fromIndex, 1).pop()
    items.splice(this.state.toIndex, 0, item)
    return items
  }

  position(p1, operator, p2) {
    switch (operator) {
      case '+': return [p1[0] + p2[0], p1[1] + p2[1]]
      case '-': return [p1[0] - p2[0], p1[1] - p2[1]]
      default: return [0, 0]
    }
  }

  itemIndexAtPosition(position) {
    const list = findDOMNode(this.refs.list)
    const item = document.elementsFromPoint(...position)
      .find(node => node.parentNode == list)
    return Array.prototype.indexOf.call(list.childNodes || [], item)
  }

  itemPositionForIndex(index) {
    const list = findDOMNode(this.refs.list)
    const item = list.childNodes.item(index)
    return [item.offsetLeft, item.offsetTop]
  }

  onMoveGesture(state, position) {
    if (!this.props.canMove) return
    const index = this.itemIndexAtPosition(position)
    if (index < 0) return
    switch (state) {
      case 'begin':
        this.setState({
          gestureRunning: true,
          fromIndex: index,
          offset: this.position(
            this.itemPositionForIndex(index), '-', position
          ),
          toIndex: index,
          position: position
        })
        break
      case 'change':
        if (!this.state.gestureRunning) break
        this.setState({
          toIndex: index,
          position: position
        })
        break
      case 'end':
        if (!this.state.gestureRunning) break
        this.setState({
          gestureRunning: false,
          fromIndex: -1,
          toIndex: -1
        })
        break
      case 'cancel':
        if (!this.state.gestureRunning) break
        this.setState({
          gestureRunning: false,
          fromIndex: -1,
          toIndex: -1
        })
        break
    }
  }

  onTouchStart = (event) => {
  }

  onTouchMove = (event) => {
  }

  onTouchEnd = (event) => {
  }

  onTouchCancel = (event) => {
  }

  onMouseDown = (event) => {
    if (
      event.button != 0 ||
      event.ctrlKey || event.shiftKey || event.altKey || event.metaKey
    ) return
    event.preventDefault()
    this.onMoveGesture('begin', [event.clientX, event.clientY])
  }

  onMouseMove = (event) => {
    event.preventDefault()
    this.onMoveGesture('change', [event.clientX, event.clientY])
  }

  onMouseUp = (event) => {
    event.preventDefault()
    this.onMoveGesture('end', [event.clientX, event.clientY])
  }

  onMouseLeave = (event) => {
    event.preventDefault()
    this.onMoveGesture('cancel', [event.clientX, event.clientY])
  }

  render() {
    const style = this.generateStyle()
    return (
      <div style={style.container}>
        <div
          style={style.view}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
          onTouchCancel={this.onTouchCancel}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseLeave={this.onMouseLeave}
        >
          <FlipMove
            typeName='div'
            style={style.list}
            easing='ease'
            duration={250}
            ref='list'
          >
            {this.sortedItems().map(({key, ...props}, index) => (
              <div style={style.item} key={key}>
                {this.state.toIndex != index ? <Item {...props} /> : null}
              </div>
            ))}
          </FlipMove>
          {
            this.state.fromIndex >= 0
              ? <div style={{...style.item, ...style.itemSnapshot}}>
                  <Item {...this.props.items[this.state.fromIndex]} />
                </div>
              : null
          }
        </div>
      </div>
    )
  }

  generateStyle() {
    return {
      container: {
        boxSizing: 'border-box',
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
      },
      view: {
        position: 'relative'
      },
      list: {
        display: 'flex',
        flexWrap: 'wrap'
      },
      item: {
        boxSizing: 'border-box',
        height: this.props.muiTheme.gridTile.boxHeight,
        width: `${100 / 2}%`,
        padding: this.props.muiTheme.spacing.desktopGutterMini,
        [this.props.muiTheme.responsive.tablet.mediaQuery]: {
          width: `${100 / 3}%`
        },
        [this.props.muiTheme.responsive.desktop.mediaQuery]: {
          width: `${100 / 4}%`
        }
      },
      itemSnapshot: {
        position: 'absolute',
        left: this.state.position[0] + this.state.offset[0],
        top: this.state.position[1] + this.state.offset[1]
      }
    }
  }
}
