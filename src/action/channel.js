export const name = {
  type: 'ChannelName',
  create(name) { return {type: this.type, name} }
}

export const members = {
  type: 'ChannelMembers',
  create(members) { return {type: this.type, members} }
}
