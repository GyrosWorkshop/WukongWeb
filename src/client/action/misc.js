export const notification = {
  type: 'MiscNotification',
  create(notification) { return {type: this.type, notification} }
}
