export const members = {
  type: 'ChannelMembers',
  create(members) { return {type: this.type, members} }
}
