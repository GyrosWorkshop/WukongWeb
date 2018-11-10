import reducer from '../reducer'
import Action from '../action'

let state
const dispatcher = (action) => (...args) =>
  state = reducer(state, action.create(...args))

beforeEach(() => state = {})

describe('reduce user', () => {
  const profile = dispatcher(Action.User.profile)
  const auth = dispatcher(Action.User.auth)
  const preferences = dispatcher(Action.User.preferences)

  test('with profile action', () => {
    profile({id: 1, name: 'test'})
    expect(state.user.profile).toEqual({id: 1, name: 'test'})
    profile({id: 1, name: 'user'})
    expect(state.user.profile).toEqual({id: 1, name: 'user'})
  })

  test('with auth action', () => {
    auth({status: false, provider: 'test'})
    expect(state.user.auth).toEqual({status: false, provider: 'test'})
    auth({status: true})
    expect(state.user.auth).toEqual({status: true, provider: 'test'})
  })

  test('with preferences action', () => {
    preferences({key1: 'value1'})
    expect(state.user.preferences).toEqual({key1: 'value1'})
    preferences({key2: 'value2'})
    expect(state.user.preferences).toEqual({key1: 'value1', key2: 'value2'})
    preferences({key2: 'value3'})
    expect(state.user.preferences).toEqual({key1: 'value1', key2: 'value3'})
  })
})

describe('reduce channel', () => {
  const name = dispatcher(Action.Channel.name)
  const members = dispatcher(Action.Channel.members)

  test('with name action', () => {
    name('hello')
    expect(state.channel.name).toEqual('hello')
    name('test')
    expect(state.channel.name).toEqual('test')
  })

  test('with members action', () => {
    members(['member1'])
    expect(state.channel.members).toEqual(['member1'])
    members(['member1', 'member2'])
    expect(state.channel.members).toEqual(['member1', 'member2'])
  })
})

describe('reduce song', () => {
  const add = dispatcher(Action.Song.add)
  const remove = dispatcher(Action.Song.remove)
  const move = dispatcher(Action.Song.move)
  const assign = dispatcher(Action.Song.assign)
  const shuffle = dispatcher(Action.Song.shuffle)
  const sync = dispatcher(Action.Song.sync)
  const play = dispatcher(Action.Song.play)
  const preload = dispatcher(Action.Song.preload)

  test('with add action', () => {
    add({id: 'a'})
    expect(state.song.playlist).toEqual([{id: 'a'}])
    add({id: 'a'})
    expect(state.song.playlist).toEqual([{id: 'a'}])
    add({id: 'b'})
    expect(state.song.playlist).toEqual([{id: 'b'}, {id: 'a'}])
  })

  test('with remove action', () => {
    assign([{id: 'a'}, {id: 'b'}])
    remove('b')
    expect(state.song.playlist).toEqual([{id: 'a'}])
    remove('b')
    expect(state.song.playlist).toEqual([{id: 'a'}])
    remove('a')
    expect(state.song.playlist).toEqual([])
  })

  test('with move action', () => {
    assign([{id: 'a'}, {id: 'b'}])
    move('a', 'b')
    expect(state.song.playlist).toEqual([{id: 'b'}, {id: 'a'}])
    move('b', 1)
    expect(state.song.playlist).toEqual([{id: 'a'}, {id: 'b'}])
    move('a', -1)
    expect(state.song.playlist).toEqual([{id: 'a'}, {id: 'b'}])
    move(0, 0)
    expect(state.song.playlist).toEqual([{id: 'a'}, {id: 'b'}])
  })

  test('with assign action', () => {
    assign([{id: 'a'}, {id: 'b'}])
    expect(state.song.playlist).toEqual([{id: 'a'}, {id: 'b'}])
  })

  test('with shuffle action', () => {
    assign([{id: 'a'}, {id: 'b'}, {id: 'c'}])
    shuffle()
    expect(state.song.playlist).toContainEqual({id: 'a'})
    expect(state.song.playlist).toContainEqual({id: 'b'})
    expect(state.song.playlist).toContainEqual({id: 'c'})
  })

  test('with sync action', () => {
    sync()
  })

  test('with play action', () => {
    play({id: 'song'})
    expect(state.song.playing).toEqual({id: 'song'})
  })

  test('with preload action', () => {
    preload({id: 'song'})
    expect(state.song.preload).toEqual({id: 'song'})
  })
})

describe('reduce player', () => {
  const running = dispatcher(Action.Player.running)
  const elapsed = dispatcher(Action.Player.elapsed)
  const duration = dispatcher(Action.Player.duration)
  const ended = dispatcher(Action.Player.ended)
  const downvote = dispatcher(Action.Player.downvote)
  const volume = dispatcher(Action.Player.volume)
  const reload = dispatcher(Action.Player.reload)
  const reset = dispatcher(Action.Player.reset)

  test('with running action', () => {
    running(false)
    expect(state.player.running).toEqual(false)
    running(true)
    expect(state.player.running).toEqual(true)
  })

  test('with elapsed action', () => {
    elapsed(1)
    expect(state.player.elapsed).toEqual(1)
    elapsed(2)
    expect(state.player.elapsed).toEqual(2)
  })

  test('with duration action', () => {
    duration(10)
    expect(state.player.duration).toEqual(10)
    duration(20)
    expect(state.player.duration).toEqual(20)
  })

  test('with ended action', () => {
    ended()
    expect(state.player.ended).toEqual(true)
  })

  test('with downvote action', () => {
    downvote()
    expect(state.player.downvote).toEqual(true)
  })

  test('with volume action', () => {
    volume(0.5)
    expect(state.player.volume).toEqual(0.5)
    volume(0.25)
    expect(state.player.volume).toEqual(0.25)
  })

  test('with reload action', () => {
    reload(true)
    expect(state.player.reload).toEqual(true)
    reload(false)
    expect(state.player.reload).toEqual(false)
  })

  test('with reset action', () => {
    ended()
    downvote()
    reset({downvote: false})
    expect(state.player.ended).toEqual(false)
    expect(state.player.downvote).toEqual(false)
    ended()
    downvote()
    reset({downvote: true})
    expect(state.player.ended).toEqual(false)
    expect(state.player.downvote).toEqual(true)
  })
})

describe('reduce search', () => {
  const keyword = dispatcher(Action.Search.keyword)
  const results = dispatcher(Action.Search.results)

  test('with keyword action', () => {
    keyword('search')
    expect(state.search.keyword).toEqual('search')
    keyword('keyword')
    expect(state.search.keyword).toEqual('keyword')
  })

  test('with results action', () => {
    results(['song'])
    expect(state.search.results).toEqual(['song'])
    results(['song1', 'song2'])
    expect(state.search.results).toEqual(['song1', 'song2'])
  })
})

describe('reduce misc', () => {
  const notification = dispatcher(Action.Misc.notification)
  const connection = dispatcher(Action.Misc.connection)

  test('with notification action', () => {
    notification({message: 'text', action: 'ok'})
    expect(state.misc.notification).toEqual({message: 'text', action: 'ok'})
    notification({})
    expect(state.misc.notification).toEqual({})
  })

  test('with connection action', () => {
    connection({status: true})
    expect(state.misc.connection).toEqual({status: true})
    connection({status: false, message: 'text'})
    expect(state.misc.connection).toEqual({status: false, message: 'text'})
  })
})
