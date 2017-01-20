import {combineReducers} from 'redux'

import user from './user'
import channel from './channel'
import song from './song'
import player from './player'
import search from './search'
import misc from './misc'

export default combineReducers({
  user,
  channel,
  song,
  player,
  search,
  misc
})
