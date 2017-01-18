import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import SearchForm from './search-form'
import ButtonBar from './button-bar'
import SyncButton from './sync-button'
import ShuffleButton from './shuffle-button'
import style from './omni-panel.css'

@CSSModules(style)
export default class OmniPanel extends PureComponent {
  render() {
    return (
      <div styleName='container'>
        <SearchForm/>
        <ButtonBar>
          <SyncButton/>
          <ShuffleButton/>
        </ButtonBar>
      </div>
    )
  }
}
