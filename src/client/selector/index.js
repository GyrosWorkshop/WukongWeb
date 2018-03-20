import {createSelector} from 'reselect'
import {get, flow, fromPairs} from 'lodash'

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
    const fileLevel = file => get(file, 'quality.level', 0)
    const results = files
      .sort((file1, file2) => {
        const level1 = fileLevel(file1)
        const level2 = fileLevel(file2)
        const diff1 = Math.abs(level1 - level)
        const diff2 = Math.abs(level2 - level)
        if (diff1 != diff2) {
          return diff1 - diff2
        } else {
          return level2 - level1
        }
      })
    return results[0]
  }
)

export default {
  playingArtwork: composeSelector(
    takeState,
    getValue('song.playing.artwork'),
    selectConnection,
    getValue('url')
  ),
  preloadArtwork: composeSelector(
    takeState,
    getValue('song.preload.artwork'),
    selectConnection,
    getValue('url')
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
  currentSongs: createSelector(
    createSelector(
      selectState('song.playlist'),
      (playlist) => {
        return playlist.map(song => ({
          song,
          search: false,
          added: true
        }))
      }
    ),
    createSelector(
      selectState('song.playlist'),
      selectState('search.results'),
      (playlist, results) => {
        const table = fromPairs(playlist.map(song => [
          song.id, true
        ]))
        return results.map(song => ({
          song,
          search: true,
          added: !!table[song.id]
        }))
      }
    ),
    selectState('search.keyword'),
    (playlist, results, keyword) => keyword ? results : playlist
  ),
  currentLyrics: createSelector(
    selectState('song.playing.lyrics'),
    selectState('player.elapsed'),
    (lyrics, elapsed) => {
      if (!lyrics || !lyrics.length) return ['没有歌词 o(*≧▽≦)ツ']
      return lyrics.map(lines => {
        const line = lines.find((line, index) => {
          const nextLine = lines[index + 1]
          if (!nextLine) return true
          if (elapsed < nextLine.time) return true
          return false
        }) || {}
        return line.text || ''
      })
    }
  )
}
