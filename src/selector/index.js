import {createSelector} from 'reselect'
import {get, flow} from 'lodash'

import artworkImage from '../resource/artwork.png'

const composeSelector = (...functions) => flow(functions)()
const takeState = () => state => state
const getValue = property => selector =>
  object => get(selector(object), property)
const setDefaultValue = defaultValue => selector =>
  object => selector(object) || defaultValue

const selectState = property => composeSelector(
  takeState,
  getValue(property)
)

const selectConnection = fileSelector => createSelector(
  setDefaultValue({})(fileSelector),
  selectState('user.preferences.connection'),
  (file, connection) => {
    const {urls, ...properties} = file
    return {
      url: urls && urls[connection],
      ...properties
    }
  }
)

const selectAudioQuality = filesSelector => createSelector(
  setDefaultValue([])(filesSelector),
  selectState('user.preferences.audioQuality'),
  (files, level) => {
    const results = files.filter(file => file.quality.level <= level)
      .sort((file1, file2) => file2.quality.level - file1.quality.level)
    return results[0]
  }
)

export default {
  playingArtwork: composeSelector(
    takeState,
    getValue('song.playing.artwork'),
    selectConnection,
    getValue('url'),
    setDefaultValue(artworkImage)
  ),
  playingFile: composeSelector(
    takeState,
    getValue('song.playing.files'),
    selectAudioQuality,
    selectConnection
  ),
  preloadFile: composeSelector(
    takeState,
    getValue('song.preload.files'),
    selectAudioQuality,
    selectConnection
  ),
  playerIndex: createSelector(
    selectState('channel.members'),
    selectState('song.playing.player'),
    (members, player) => members.map(member => member.id).indexOf(player)
  ),
  selfPlaying: createSelector(
    selectState('user.id'),
    selectState('song.playing.player'),
    (user, player) => user && player && (user == player)
  )
}
