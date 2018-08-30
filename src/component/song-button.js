import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import style from './song-button.css'

export default
@CSSModules(style)
class SongButton extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    action: PropTypes.func,
    context: PropTypes.any
  }

  onButtonClick = (event) => {
    const {action, context} = this.props
    if (action) {
      action(context)
    }
  }

  render() {
    const {icon} = this.props
    return (
      <div styleName='container'>
        <button onClick={this.onButtonClick}>
          <i className={`fa fa-${icon}`}/>
        </button>
      </div>
    )
  }
}
