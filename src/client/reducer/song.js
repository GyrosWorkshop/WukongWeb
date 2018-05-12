import {combineReducers} from 'redux'
import shuffle from 'lodash/shuffle'

import Action from '../action'

function playlist(state = [], action) {
  switch (action.type) {
    case Action.Song.add.type:
      return [
        action.song,
        ...state.filter(song => song.id != action.song.id)
      ]
    case Action.Song.remove.type:
      return [
        ...state.filter(song => song.id != action.id)
      ]
    case Action.Song.move.type: {
      const indexOf = value => Number.isInteger(value)
        ? value
        : state.findIndex(song => song.id == value)
      const fromIndex = indexOf(action.from)
      const toIndex = indexOf(action.to)
      if (fromIndex < 0 || toIndex < 0) return state
      if (fromIndex == toIndex) return state
      const newState = state.slice()
      const item = newState.splice(fromIndex, 1).pop()
      newState.splice(toIndex, 0, item)
      return newState
    }
    case Action.Song.assign.type:
      return [...action.songs]
    case Action.Song.shuffle.type:
      return shuffle(state)
    default:
      return state
  }
}

function playing(state = {}, action) {
  switch (action.type) {
    case Action.Song.play.type:
      return {...action.song}
    default:
      return state
  }
}

function preload(state = {}, action) {
  switch (action.type) {
    case Action.Song.preload.type:
      return {...action.song}
    default:
      return state
  }
}

export default combineReducers({
  playlist,
  playing,
  preload
})
