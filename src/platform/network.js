import 'whatwg-fetch'

const state = {
  hook: () => {}
}

export function url(protocol, endpoint) {
  return __env.server.replace(/^http/i, protocol) + endpoint
}

export async function http(method, endpoint, data) {
  const response = await fetch(url('http', endpoint), {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
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
  const emit = handler(send)
  let interval
  socket.onopen = event => {
    emit('open', event)
    interval = setInterval(send, 30 * 1000, 'ping')
  }
  socket.onclose = event => {
    clearInterval(interval)
    if (event.code === 1000) {
      // Normal closure
      emit('disconnect')
    } else {
      emit('close', event)
      setTimeout(connect, 5 * 1000)
    }
  }
  socket.onerror = event => {
    emit('error', event)
  }
  socket.onmessage = event => {
    const string = event.data
    const {eventName, ...eventData} = JSON.parse(string)
    emit(eventName, eventData)
  }
}

export function hook(callback) {
  state.hook = callback
}
