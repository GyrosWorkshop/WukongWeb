export const profile = {
  type: 'UserProfile',
  create(profile) { return {type: this.type, profile} }
}

export const preferences = {
  type: 'UserPreferences',
  create(preferences) { return {type: this.type, preferences} }
}
