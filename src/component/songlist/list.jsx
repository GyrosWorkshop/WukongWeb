import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Radium from 'radium'
import FlipMove from 'react-flip-move'
import LazyLoad from 'react-lazyload'
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
    const {fromIndex, toIndex} = this.state
    if (fromIndex >= 0) {
      const item = items.splice(fromIndex, 1).pop()
      items.splice(toIndex, 0, item)
    }
    return items
  }

  position(p1, operator, p2) {
    switch (operator) {
      case '+': return [p1[0] + p2[0], p1[1] + p2[1]]
      case '-': return [p1[0] - p2[0], p1[1] - p2[1]]
      default: return [0, 0]
    }
  }

  positionAsTranslate(position) {
    return `translate(${position.map(value => `${value}px`).join()})`
  }

  itemIndexAtPosition(position) {
    const list = findDOMNode(this.refs.list)
    if (!list) return -1
    const item = list.childNodes.item(0)
    if (!item) return -1
    const count = Math.round(list.offsetWidth / item.offsetWidth)
    const row = Math.floor(position[1] / item.offsetHeight)
    const column = Math.floor(position[0] / item.offsetWidth)
    const index = row * count + column
    return Math.min(Math.max(index, 0), this.props.items.length - 1)
  }

  itemPositionForIndex(index) {
    const list = findDOMNode(this.refs.list)
    const item = list.childNodes.item(index)
    return [item.offsetLeft, item.offsetTop]
  }

  snapshotPosition() {
    const {position, offset} = this.state
    return this.position(position, '+', offset)
  }

  updateManually() {
    const snapshot = findDOMNode(this.refs.snapshot)
    snapshot.style.transform = this.positionAsTranslate(this.snapshotPosition())
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
        this.props.onItemMove(this.state.fromIndex, this.state.toIndex)
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

  isValidMouseEvent(event) {
    if (event.button != 0) return false
    if (event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.metaKey) return false
    if (event.target.parentNode.parentNode.parentNode
        != event.currentTarget) return false
    return true
  }

  convertMousePosition(event) {
    const {left, top} = event.currentTarget.getBoundingClientRect()
    const {clientX, clientY} = event
    return [clientX - left, clientY - top]
  }

  onMouseDown = (event) => {
    if (!this.isValidMouseEvent(event)) return
    event.preventDefault()
    this.onMoveGesture('begin', this.convertMousePosition(event))
  }

  onMouseMove = (event) => {
    this.onMoveGesture('change', this.convertMousePosition(event))
  }

  onMouseUp = (event) => {
    this.onMoveGesture('end', this.convertMousePosition(event))
  }

  onMouseLeave = (event) => {
    this.onMoveGesture('cancel', this.convertMousePosition(event))
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props != nextProps ||
        this.state.toIndex != nextState.toIndex) return true
    this.updateManually()
    return false
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.gestureRunning && !this.state.gestureRunning) {
      const list = findDOMNode(this.refs.list)
      const item = list.childNodes.item(prevState.toIndex)
      const position = this.itemPositionForIndex(prevState.toIndex)
      const snapshotPosition = this.snapshotPosition()
      const translate = this.position(snapshotPosition, '-', position)
      item.style.transform = this.positionAsTranslate(translate)
      item.style.zIndex = '1'
      requestAnimationFrame(() => requestAnimationFrame(() => {
        item.style.transition = 'transform 250ms ease'
        item.style.transform = ''
      }))
      const cleanup = event => {
        item.style.transition = ''
        item.style.zIndex = ''
        item.removeEventListener('transitionend', cleanup)
      }
      item.addEventListener('transitionend', cleanup)
    }
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
                <LazyLoad
                  height={this.props.muiTheme.gridTile.boxHeight}
                  offset={this.props.muiTheme.gridTile.boxHeight}
                  overflow={true}
                >
                  {this.state.toIndex != index ? <Item {...props} /> : null}
                </LazyLoad>
              </div>
            ))}
          </FlipMove>
          {
            this.state.fromIndex >= 0
              ? <div
                  style={{...style.item, ...style.itemSnapshot}}
                  ref='snapshot'
                >
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
        left: 0,
        top: 0,
        transform: this.positionAsTranslate(this.snapshotPosition())
      }
    }
  }
}
