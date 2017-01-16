import React, {PureComponent, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './song-button.css'

@CSSModules(style)
export default class SongButton extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    action: PropTypes.func
  }

  onButtonAction = (event) => {
    const {action} = this.props
    if (action) {
      action()
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
