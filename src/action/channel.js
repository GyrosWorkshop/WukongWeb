export const status = {
  type: 'ChannelStatus',
  create(status) { return {type: this.type, status} }
}
