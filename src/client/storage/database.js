import {merge, pick, isEqual} from 'lodash'

export default function Database(Platform) {
  const key = 'wukong'
  const data = {
    open: {
      user: {
        auth: {
          status: true
        },
        preferences: {
          listenOnly: false,
          connection: 0,
          audioQuality: 2
        }
      },
      misc: {
        connection: {
          status: true
        }
      }
    },
    save: {}
  }

  const database = {}

  database.open = (state = {}) => {
    try {
      return merge(data.open, JSON.parse(Platform.Database.get(key)), state)
    } catch (error) {
      return state
    }
  }

  database.save = (state = {}) => {
    try {
      const data = pick(state, [
        'user.preferences',
        'song.playlist',
        'player.volume'
      ])
      if (isEqual(data, data.save)) return
      Platform.Database.set(key, JSON.stringify(data))
      data.save = data
    } catch (error) {
      Platform.Database.remove(key)
    }
  }

  return database
}
