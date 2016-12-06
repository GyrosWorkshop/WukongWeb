export const running = {
  type: 'PlayerRunning',
  create(running) { return {type: this.type, running} }
}

export const elapsed = {
  type: 'PlayerElapsed',
  create(elapsed) { return {type: this.type, elapsed} }
}

export const ended = {
  type: 'PlayerEnded',
  create() { return {type: this.type} }
}

export const downvote = {
  type: 'PlayerDownvote',
  create() { return {type: this.type} }
}

export const reset = {
  type: 'PlayerReset',
  create() { return {type: this.type} }
}
