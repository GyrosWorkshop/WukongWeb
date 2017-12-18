export function setTimeout(handler, timeout) {
  return window.setTimeout(handler, timeout)
}

export function setInterval(handler, timeout) {
  return window.setInterval(handler, timeout)
}

export function clearTimeout(handle) {
  window.clearTimeout(handle)
}

export function clearInterval(handle) {
  window.clearInterval(handle)
}
