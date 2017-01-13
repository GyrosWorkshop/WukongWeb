import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import VolumeSlider from './volume-slider'
import style from './action-bar.css'

@CSSModules(style)
export default class ActionBar extends PureComponent {
  render() {
    return (
      <div styleName='container'>
        <VolumeSlider/>
      </div>
    )
  }
}
