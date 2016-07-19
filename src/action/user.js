export const profile = {
  type: 'UserProfile',
  create(profile) { return {type: this.type, profile} }
}
