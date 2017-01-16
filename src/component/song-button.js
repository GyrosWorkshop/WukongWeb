import React, {PureComponent, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './song-button.css'

@CSSModules(style)
export default class SongButton extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    action: PropTypes.func,
    context: PropTypes.any
  }

  onButtonAction = (event) => {
    const {action, context} = this.props
    if (action) {
      action(context)
    }
  }

  render() {
    const {icon} = this.props
    return (
      <div styleName='container'>
        <button onClick={this.onButtonAction}>
          <i className={`fa fa-${icon}`}/>
        </button>
      </div>
    )
  }
}
