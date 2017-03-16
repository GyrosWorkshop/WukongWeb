import 'whatwg-fetch'

const origin = `${location.protocol}//${location.host}`
const server = __env.production ? origin : (
  __env.server || 'http://localhost:5000'
)

export default function Network(hook) {
  const network = {}

  network.url = (protocol, endpoint) => {
    return server.replace(/^http/i, protocol) + endpoint
  }

  network.http = async (method, endpoint, data) => {
    const response = await fetch(network.url('http', endpoint), {
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
    hook(method, endpoint, response)
    const string = await response.text()
    return string && JSON.parse(string)
  }

  network.websocket = (endpoint, handler) => {
    const socket = new WebSocket(network.url('ws', endpoint))
    const connect = () => network.websocket(endpoint, handler)
    const send = (eventName, eventData) => socket.send(JSON.stringify({
      eventName,
      ...eventData
    }))
    const emit = handler(send)
    socket.onopen = event => {
      emit('open', event)
    }
    socket.onclose = event => {
      emit('close', event)
      setTimeout(connect, 5 * 1000)
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

  return network
}
