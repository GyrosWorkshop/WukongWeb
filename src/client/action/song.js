export const add = {
  type: 'SongAdd',
  create(song) { return {type: this.type, song} }
}

export const remove = {
  type: 'SongRemove',
  create(id) { return {type: this.type, id} }
}

export const move = {
  type: 'SongMove',
  create(from, to) { return {type: this.type, from, to} }
}

export const assign = {
  type: 'SongAssign',
  create(songs) { return {type: this.type, songs} }
}

export const shuffle = {
  type: 'SongShuffle',
  create() { return {type: this.type} }
}

export const sync = {
  type: 'SongSync',
  create() { return {type: this.type} }
}

export const play = {
  type: 'SongPlay',
  create(song) { return {type: this.type, song} }
}

export const preload = {
  type: 'SongPreload',
  create(song) { return {type: this.type, song} }
}
