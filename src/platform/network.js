import 'whatwg-fetch'

const state = {
  hook: () => { }
}

export function url(protocol, endpoint) {
  return process.env.API_SERVER.replace(/^http/i, protocol) + endpoint
}

export async function http(method, endpoint, data) {
  const response = await fetch(url('http', endpoint), {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
    redirect: 'manual',
    referrer: 'no-referrer'
  })
  const status = response.status
  const error = response.ok ? null : response.statusText
  state.hook(method, endpoint, status, error)
  const string = await response.text()
  const type = response.headers.get('content-type')
  if (type) {
    if (type.startsWith('application/json')) {
      return JSON.parse(string)
    }
  }
  return string
}

export function websocket(endpoint, handler) {
  const socket = new WebSocket(url('ws', endpoint))
  const connect = () => websocket(endpoint, handler)
  const send = (eventName, eventData) => socket.send(JSON.stringify({
    eventName,
    ...eventData
  }))
  const ping = () => send('ping')
  const emit = handler(connect, ping)
  socket.onopen = event => emit('open', event)
  socket.onclose = event => emit('close', event)
  socket.onerror = event => emit('error', event)
  socket.onmessage = event => {
    const string = event.data
    const { eventName, ...eventData } = JSON.parse(string)
    emit(eventName, eventData)
  }
}

export function hook(callback) {
  state.hook = callback
}
