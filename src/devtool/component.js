import React from 'react'
import {createDevTools} from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'
import FilteredMonitor from 'redux-devtools-filter-actions'
import get from 'lodash/get'
import set from 'lodash/set'
import size from 'lodash/size'
import cloneDeep from 'lodash/cloneDeep'

import {Action} from '../client'

function redact(object, path) {
  if (object.redacted) return object
  const value = get(object, path)
  if (!value) return object
  const result = cloneDeep(object)
  result.redacted = true
  set(result, path, `<${value.constructor.name} size=${size(value)}>`)
  return result
}

export default createDevTools(
  <DockMonitor
    defaultPosition='bottom'
    defaultIsVisible={false}
    toggleVisibilityKey='ctrl-h'
    changePositionKey='ctrl-q'>
    <FilteredMonitor
      blacklist={[
        Action.Player.elapsed.type,
        Action.Player.duration.type,
        Action.Player.volume.type
      ]}
      actionsFilter={action => {
        switch (action.type) {
          case Action.Song.play.type:
            return redact(action, 'song.lyrics')
          default:
            return action
        }
      }}>
      <LogMonitor theme='tomorrow'/>
    </FilteredMonitor>
  </DockMonitor>
)
