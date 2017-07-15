export function url() {
  return location.href
}

export function webview(url) {
  location.href = url
}

export function reload() {
  location.reload(true)
}
