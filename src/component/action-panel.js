import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import ProgressIndicator from './progress-indicator'
import ButtonBar from './button-bar'
import ReloadButton from './reload-button'
import DownvoteButton from './downvote-button'
import SilenceButton from './silence-button'
import ConnectionButton from './connection-button'
import QualityButton from './quality-button'
import DownloadButton from './download-button'
import VolumeSlider from './volume-slider'
import style from './action-panel.css'

@CSSModules(style)
export default class ActionPanel extends PureComponent {
  render() {
    return (
      <div styleName='container'>
        <ProgressIndicator/>
        <ButtonBar>
          <ReloadButton/>
          <DownvoteButton/>
          <SilenceButton/>
          <ConnectionButton/>
          <QualityButton/>
          <DownloadButton/>
        </ButtonBar>
        <VolumeSlider/>
      </div>
    )
  }
}
