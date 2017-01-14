import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import ButtonBar from './button-bar'
import ReloadButton from './reload-button'
import DownvoteButton from './downvote-button'
import SilenceButton from './silence-button'
import QualityButton from './quality-button'
import ConnectionButton from './connection-button'
import VolumeSlider from './volume-slider'
import style from './action-panel.css'

@CSSModules(style)
export default class ActionPanel extends PureComponent {
  render() {
    return (
      <div styleName='container'>
        <ButtonBar>
          <ReloadButton/>
          <DownvoteButton/>
          <SilenceButton/>
          <ConnectionButton/>
          <QualityButton/>
        </ButtonBar>
        <VolumeSlider/>
      </div>
    )
  }
}
