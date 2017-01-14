import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import ButtonBar from './button-bar'
import VolumeSlider from './volume-slider'
import style from './action-panel.css'

@CSSModules(style)
export default class ActionPanel extends PureComponent {
  render() {
    return (
      <div styleName='container'>
        <ButtonBar/>
        <VolumeSlider/>
      </div>
    )
  }
}
