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

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {pane} = this.refs
    if (this.props.open) {
      pane.style.height = 'auto'
    } else {
      pane.style.height = '0'
    }
  }

  render() {
    const {children} = this.props
    return (
      <div ref='pane' styleName='container'>
        {children}
      </div>
    )
  }
}
