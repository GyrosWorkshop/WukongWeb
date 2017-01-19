import React, {PureComponent, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './collapsed-pane.css'

@CSSModules(style)
export default class CollapsedPane extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    children: PropTypes.node
  }

  state = {
    height: 'auto'
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.children != prevProps.children) {
      this.setState({height: `${this.refs.pane.scrollHeight}px`})
    }
  }

  render() {
    const {open, children} = this.props
    const {height} = this.state
    return (
      <div ref='pane' styleName='container' style={{
        height: open ? height : 0
      }}>
        {children}
      </div>
    )
  }
}
