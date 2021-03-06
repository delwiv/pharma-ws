import http from 'http'
import socketIo from 'socket.io'

import configureClients from './clients/index.js'
import configureServers from './servers/index.js'
import { connect as connectRedis, get, set } from './lib/redis.js'

import config from './config.json'
import packageJson from '../package.json'

console.log({ config })
const { name, version } = packageJson
const { PORT } = config

const getVersion = (req, res) => res.json({ name, version })

const getStatus = async (req, res) => {
  await set('key', 'value')
  const val = await get('key')
  if (val === 'value') {
    return res.json({
      service: 'redis',
      status: 'OK'
    })
  }
  return res.json({
    service: 'redis',
    status: 'KO'
  })
}

const start = async () => {
  const httpServer = http.createServer((req, res) => {
    if (req.method === 'GET') {
      if (req.path === '/version') return getVersion(req, res)

      if (req.path === '/status') return getStatus(req, res)

      if (req.path === '/') return res.json({})
    }
  })

  const io = socketIo(httpServer)

  await connectRedis()

  configureClients(io)
  configureServers(io)

  httpServer.listen(PORT, () => {
    console.log('Websocket server listenning on ', PORT)
  })
}

start()
