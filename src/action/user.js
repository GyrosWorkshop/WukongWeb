export const profile = {
  type: 'UserProfile',
  create(profile) { return {type: this.type, profile} }
}

export const sync = {
  type: 'UserSync',
  create() { return {type: this.type} }
}
