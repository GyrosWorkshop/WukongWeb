import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import SearchForm from './search-form'
import ButtonBar from './button-bar'
import SyncButton from './sync-button'
import ShuffleButton from './shuffle-button'
import ButtonItem from './button-item'
import CollapsedPane from './collapsed-pane'
import ConfigForm from './config-form'
import style from './omni-panel.css'

@CSSModules(style)
export default class OmniPanel extends PureComponent {
  state = {
    expanded: false
  }

  onButtonAction = (event) => {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const {expanded} = this.state
    return (
      <div styleName='container'>
        <div styleName='row'>
          <SearchForm/>
          <ButtonBar>
            <SyncButton/>
            <ShuffleButton/>
            <ButtonItem icon='cog' action={this.onButtonAction}>
              <p>Config</p>
            </ButtonItem>
          </ButtonBar>
        </div>
        <CollapsedPane open={expanded}>
          <ConfigForm/>
        </CollapsedPane>
      </div>
    )
  }
}
