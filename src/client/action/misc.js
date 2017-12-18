export const notification = {
  type: 'MiscNotification',
  create(notification) { return {type: this.type, notification} }
}

export const connection = {
  type: 'MiscConnection',
  create(connection) { return {type: this.type, connection} }
}
