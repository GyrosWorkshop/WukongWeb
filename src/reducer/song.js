import {combineReducers} from 'redux'

import Action from '../action'

function playlist(state = [], action) {
  switch (action.type) {
    case Action.Song.prepend.type:
      return [
        action.song,
        ...state.filter(song => song.id != action.song.id)
      ]
    case Action.Song.append.type:
      return [
        ...state.filter(song => song.id != action.song.id),
        action.song
      ]
    case Action.Song.remove.type:
      return state.filter(song => song.id != action.song.id)
    default:
      return state
  }
}

function playing(state = {}, action) {
  switch (action.type) {
    case Action.Song.play.type:
      return action.song
    default:
      return state
  }
}

function preload(state = {}, action) {
  switch (action.type) {
    case Action.Song.preload.type:
      return action.song
    default:
      return state
  }
}

function status(state = {}, action) {
  switch  (action.type) {
    case Action.Song.play.type:
      return {}
    case Action.Song.elapsed.type:
      return {...state, elapsed: action.elapsed}
    case Action.Song.ended.type:
      return {...state, ended: true}
    case Action.Song.downvote.type:
      return {...state, downvote: true}
    default:
      return state
  }
}

export default combineReducers({
  playlist,
  playing,
  preload,
  status
})
