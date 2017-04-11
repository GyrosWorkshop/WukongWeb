export function encode(object = {}) {
  return {
    syncPlaylists: object.sync,
    cookies: object.cookie
  }
}

export function decode(object = {}) {
  return {
    sync: object.syncPlaylists,
    cookie: object.cookies
  }
}
