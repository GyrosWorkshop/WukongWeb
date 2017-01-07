export const running = {
  type: 'PlayerRunning',
  create(running) { return {type: this.type, running} }
}

export const elapsed = {
  type: 'PlayerElapsed',
  create(elapsed) { return {type: this.type, elapsed} }
}

export const duration = {
  type: 'PlayerDuration',
  create(duration) { return {type: this.type, duration} }
}

export const ended = {
  type: 'PlayerEnded',
  create() { return {type: this.type} }
}

export const downvote = {
  type: 'PlayerDownvote',
  create() { return {type: this.type} }
}

export const volume = {
  type: 'PlayerVolume',
  create(volume) { return {type: this.type, volume} }
}

export const reset = {
  type: 'PlayerReset',
  create() { return {type: this.type} }
}
