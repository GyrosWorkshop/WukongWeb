export const profile = {
  type: 'UserProfile',
  create(profile) { return {type: this.type, profile} }
}

export const auth = {
  type: 'UserAuth',
  create(auth) { return {type: this.type, auth} }
}

export const preferences = {
  type: 'UserPreferences',
  create(preferences) { return {type: this.type, preferences} }
}

export const saveConfiguration = {
  type: 'UserSaveConfiguration',
  create(preferences) { return {type: this.type, preferences}}
}
