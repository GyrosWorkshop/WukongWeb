import React from 'react'
import {createDevTools} from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'
import FilteredMonitor from 'redux-devtools-filter-actions'

import Action from '../action'

export default createDevTools(
  <DockMonitor
    defaultPosition='bottom'
    defaultIsVisible={false}
    toggleVisibilityKey='ctrl-h'
    changePositionKey='ctrl-q'
  >
    <FilteredMonitor
      whitelist={[
        Action.Song.play.type,
        Action.Song.preload.type
      ]}
    >
      <LogMonitor theme='tomorrow' />
    </FilteredMonitor>
  </DockMonitor>
)
