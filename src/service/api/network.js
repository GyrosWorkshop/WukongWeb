import 'whatwg-fetch'

const origin = `${location.protocol}//${location.host}`
const server = __env.production ? origin : (
  __env.server || 'http://localhost:5000'
)

<<<<<<< HEAD
async function handleLogin() {
  const schemes = await http('GET', '/oauth/all')
  if (!schemes || schemes.length == 0) {
    throw new Error('Login error: no available login schemes.')
  }
  let schemeUrl = ''
  if (schemes.length == 1) {
    schemeUrl = schemes[0].url
  } else {
    const scheme = prompt('Login - Please choose an OAuth2 scheme: \n\n' +
      schemes.map(it => ` - ${it.scheme}: ${it.displayName}\n`).join(''),
      schemes[0].scheme)
    schemeUrl = schemes.filter(it =>
      it.scheme.toLowerCase() == scheme.toLowerCase()
    )[0].url
  }
  location.href = `${server}${schemeUrl}?redirectUri=${
    encodeURIComponent(location)
  }`
}

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
    handleLogin()
  } else {
    throw new Error(`${response.statusText}: ${method} ${endpoint}`)
  }
}

export function websocket(endpoint, handler) {
  const socket = new WebSocket(server.replace(/^http/i, 'ws') + endpoint)
  const connect = () => websocket(endpoint, handler)
  const ping = () => socket.send(`ping ${Date.now()}`)
  const send = data => socket.send(JSON.stringify(data))
  const emit = handler(send)
  let interval = null
  socket.onopen = event => {
    emit('open', event)
    interval = setInterval(ping, 30 * 1000)
=======
export default function Network(hook) {
  const network = {}

  network.url = (protocol, endpoint) => {
    return server.replace(/^http/i, protocol) + endpoint
>>>>>>> qusic
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
    return JSON.parse(string)
  }
<<<<<<< HEAD
  socket.onmessage = event => {
    if (event.data) {
      if (event.data.startsWith('pong ')) return
      const {eventName, ...eventData} = JSON.parse(event.data)
=======

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
>>>>>>> qusic
      emit(eventName, eventData)
    }
  }

  return network
}
