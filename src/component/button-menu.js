import React, {PureComponent, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import EventListener from 'react-event-listener'

import style from './button-menu.css'

@CSSModules(style)
export default class ButtonMenu extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    children: PropTypes.node
  }

  onCloseAction = (event) => {
    const {container} = this.refs
    let element = event.target
    while (element) {
      if (element == container) return
      element = element.parentNode
    }
    this.props.onClose()
  }

  render() {
    const {open} = this.props
    return open && (
      <div styleName='container' ref='container'>
        <EventListener target={document} onClick={this.onCloseAction}/>
        {this.props.children}
      </div>
    )
  }
}
