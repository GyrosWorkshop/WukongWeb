import 'whatwg-fetch'

const origin = `${location.protocol}//${location.host}`
const server = __env.production ? origin : (
  __env.server || 'http://localhost:5000'
)

export async function http(method, endpoint, data) {
  const response = await fetch(server + endpoint, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    mode: __env.production ? 'same-origin' : 'cors',
    credentials: __env.production ? 'same-origin' : 'include',
    cache: 'default',
    redirect: 'manual',
    referrer: 'no-referrer'
  })
  if (response.ok) {
    const data = await response.text()
    if (data) {
      return JSON.parse(data)
    }
  } else if (response.status == 401) {
    location.href = `${server}/oauth/google?redirectUri=${
      encodeURIComponent(location)
    }`
  } else {
    throw new Error(`${response.statusText}: ${method} ${endpoint}`)
  }
}

export function websocket(endpoint, handler) {
  const socket = new WebSocket(server.replace(/^http/i, 'ws') + endpoint)
  const connect = () => websocket(endpoint, handler)
  const ping = () => socket.send(`ping-${Date.now()}`)
  const send = data => socket.send(JSON.stringify(data))
  const emit = handler(send)
  let interval = null
  socket.onopen = event => {
    emit('open', event)
    interval = setInterval(ping, 30 * 1000)
  }
  socket.onclose = event => {
    emit('close', event)
    clearInterval(interval)
    setTimeout(connect, 5 * 1000)
  }
  socket.onerror = event => {
    emit('error', event)
  }
  socket.onmessage = event => {
    if (event.data) {
      const {eventName, ...eventData} = JSON.parse(event.data)
      emit(eventName, eventData)
    }
  }
}
