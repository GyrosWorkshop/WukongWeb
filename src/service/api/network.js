import 'whatwg-fetch'

const origin = `${location.protocol}//${location.host}`
const server = __env.production ? origin : (
  __env.server || 'http://localhost:5000'
)

export default function Network(hook) {
  return {
    async http(method, endpoint, data) {
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
      hook(response)
      const data = await response.text()
      try {
        return JSON.parse(data)
      } catch (error) {
        return data
      }
    },

    websocket(endpoint, handler) {
      const socket = new WebSocket(server.replace(/^http/i, 'ws') + endpoint)
      const connect = () => websocket(endpoint, handler)
      const ping = () => socket.send(`ping ${Date.now()}`)
      let interval = null
      socket.onopen = event => {
        handler('open', event)
        interval = setInterval(ping, 30 * 1000)
      }
      socket.onclose = event => {
        handler('close', event)
        clearInterval(interval)
        setTimeout(connect, 5 * 1000)
      }
      socket.onerror = event => {
        handler('error', event)
      }
      socket.onmessage = event => {
        const {data} = event
        try {
          const {eventName, ...eventData} = JSON.parse(data)
          handler(eventName, eventData)
        } catch (error) {
          handler('raw', data)
        }
      }
    }
  }
}
