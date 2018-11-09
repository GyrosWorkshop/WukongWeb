import reducer from '../reducer'
import Action from '../action'

describe('reduce user', () => {
  test('with profile action', () => {
    let state = {}
    expect(state = reducer(state, Action.User.profile.create({
      id: 1, name: 'test'
    }))).toHaveProperty('user.profile', {
      id: 1, name: 'test'
    })
    expect(state = reducer(state, Action.User.profile.create({
      id: 1, name: 'user'
    }))).toHaveProperty('user.profile', {
      id: 1, name: 'user'
    })
  })

  test('with auth action', () => {
    let state = {}
    expect(state = reducer(state, Action.User.auth.create({
      status: false,
      provider: 'test'
    }))).toHaveProperty('user.auth', {
      status: false,
      provider: 'test'
    })
    expect(state = reducer(state, Action.User.auth.create({
      status: true
    }))).toHaveProperty('user.auth', {
      status: true,
      provider: 'test'
    })
  })

  test('with preferences action', () => {
    let state = {}
    expect(state = reducer(state, Action.User.preferences.create({
      key1: 'value1'
    }))).toHaveProperty('user.preferences', {
      key1: 'value1'
    })
    expect(state = reducer(state, Action.User.preferences.create({
      key2: 'value2'
    }))).toHaveProperty('user.preferences', {
      key1: 'value1',
      key2: 'value2'
    })
    expect(state = reducer(state, Action.User.preferences.create({
      key2: 'value3'
    }))).toHaveProperty('user.preferences', {
      key1: 'value1',
      key2: 'value3'
    })
  })
})

describe('reduce channel', () => {
  test('with name action', () => {
    let state = {}
    expect(state = reducer(state, Action.Channel.name.create(
      'hello'
    ))).toHaveProperty('channel.name',
      'hello'
    )
    expect(state = reducer(state, Action.Channel.name.create(
      'test'
    ))).toHaveProperty('channel.name',
      'test'
    )
  })

  test('with members action', () => {
    let state = {}
    expect(state = reducer(state, Action.Channel.name.create([
      'member1'
    ]))).toHaveProperty('channel.name', [
      'member1'
    ])
    expect(state = reducer(state, Action.Channel.name.create([
      'member1', 'member2'
    ]))).toHaveProperty('channel.name', [
      'member1', 'member2'
    ])
  })
})

describe('reduce song', () => {

})

describe('reduce player', () => {
  test('with running action', () => {
    let state = {}
    expect(state = reducer(state, Action.Player.running.create(
      false
    ))).toHaveProperty('player.running',
      false
    )
    expect(state = reducer(state, Action.Player.running.create(
      true
    ))).toHaveProperty('player.running',
      true
    )
  })

  test('with elapsed action', () => {
    let state = {}
    expect(state = reducer(state, Action.Player.elapsed.create(
      1
    ))).toHaveProperty('player.elapsed',
      1
    )
    expect(state = reducer(state, Action.Player.elapsed.create(
      2
    ))).toHaveProperty('player.elapsed',
      2
    )
  })

  test('with duration action', () => {
    let state = {}
    expect(state = reducer(state, Action.Player.duration.create(
      10
    ))).toHaveProperty('player.duration',
      10
    )
    expect(state = reducer(state, Action.Player.duration.create(
      20
    ))).toHaveProperty('player.duration',
      20
    )
  })

  test('with ended action', () => {
    let state = {}
    expect(state = reducer(state, Action.Player.ended.create(
    ))).toHaveProperty('player.ended',
      true
    )
  })

  test('with downvote action', () => {
    let state = {}
    expect(state = reducer(state, Action.Player.downvote.create(
    ))).toHaveProperty('player.downvote',
      true
    )
  })

  test('with volume action', () => {
    let state = {}
    expect(state = reducer(state, Action.Player.volume.create(
      0.5
    ))).toHaveProperty('player.volume',
      0.5
    )
    expect(state = reducer(state, Action.Player.volume.create(
      0.25
    ))).toHaveProperty('player.volume',
      0.25
    )
  })

  test('with reload action', () => {
    let state = {}
    expect(state = reducer(state, Action.Player.reload.create(
      true
    ))).toHaveProperty('player.reload',
      true
    )
    expect(state = reducer(state, Action.Player.reload.create(
      false
    ))).toHaveProperty('player.reload',
      false
    )
  })

  test('with reset action', () => {
    let state = {}
    state = reducer(state, Action.Player.ended.create())
    state = reducer(state, Action.Player.downvote.create())
    state = reducer(state, Action.Player.reset.create({
      downvote: false
    }))
    expect(state).toHaveProperty('player.ended', false)
    expect(state).toHaveProperty('player.downvote', false)
    state = reducer(state, Action.Player.ended.create())
    state = reducer(state, Action.Player.downvote.create())
    state = reducer(state, Action.Player.reset.create({
      downvote: true
    }))
    expect(state).toHaveProperty('player.ended', false)
    expect(state).toHaveProperty('player.downvote', true)
  })
})

describe('reduce search', () => {
  test('with keyword action', () => {
    let state = {}
    expect(state = reducer(state, Action.Search.keyword.create(
      'search'
    ))).toHaveProperty('search.keyword',
      'search'
    )
    expect(state = reducer(state, Action.Search.keyword.create(
      'keyword'
    ))).toHaveProperty('search.keyword',
      'keyword'
    )
  })

  test('with results action', () => {
    let state = {}
    expect(state = reducer(state, Action.Search.results.create([
      'song'
    ]))).toHaveProperty('search.results', [
      'song'
    ])
    expect(state = reducer(state, Action.Search.results.create([
      'song1', 'song2'
    ]))).toHaveProperty('search.results', [
      'song1', 'song2'
    ])
  })
})

describe('reduce misc', () => {
  test('with notification action', () => {
    let state = {}
    expect(state = reducer(state, Action.Misc.notification.create({
      message: 'message',
      action: 'action'
    }))).toHaveProperty('misc.notification', {
      message: 'message',
      action: 'action'
    })
    expect(state = reducer(state, Action.Misc.notification.create({
    }))).toHaveProperty('misc.notification', {
    })
  })

  test('with connection action', () => {
    let state = {}
    expect(state = reducer(state, Action.Misc.connection.create({
      status: true
    }))).toHaveProperty('misc.connection', {
      status: true
    })
    expect(state = reducer(state, Action.Misc.connection.create({
      status: false,
      message: 'message'
    }))).toHaveProperty('misc.connection', {
      status: false,
      message: 'message'
    })
  })
})
