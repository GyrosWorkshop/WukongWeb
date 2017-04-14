import 'whatwg-fetch'

export default function Network(hook) {
  const network = {}

  network.url = (protocol, endpoint) => {
    return __env.server.replace(/^http/i, protocol) + endpoint
  }

  network.http = async (method, endpoint, data) => {
    const response = await fetch(network.url('http', endpoint), {
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
    hook(method, endpoint, response)
    const string = await response.text()
    const type = response.headers.get('content-type')
    if (type) {
      if (type.startsWith('application/json')) {
        return JSON.parse(string)
      }
    }
    return string
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
