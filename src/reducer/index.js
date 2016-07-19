import {combineReducers} from 'redux'

import user from './user'
import channel from './channel'
import song from './song'
import search from './search'

export default combineReducers({
  user,
  channel,
  song,
  search
})
