import React, {Component, PropTypes, cloneElement} from 'react'
import CSSModules from 'react-css-modules'

import style from './member-list.sss'

@CSSModules(style)
export default class MemberList extends Component {
  static propTypes = {
    highlightIndex: PropTypes.number,
    children: PropTypes.node
  }

  render() {
    const {highlightIndex, children} = this.props
    return (
      <div styleName='container' style={{
        transition: 'transform 800ms ease',
        transform: 'translateX(50%)' + `translateX(-${
          children[highlightIndex]
            ? highlightIndex * 120 + 60
            : children.length * 60
        }px)`
      }}>
        {children.map((child, index) => cloneElement(child, {
          style: {
            transition: 'transform 800ms ease',
            transform: highlightIndex == index
              ? 'scale(1,1)'
              : 'scale(0.8,0.8)'
          }
        }))}
      </div>
    )
  }
}
