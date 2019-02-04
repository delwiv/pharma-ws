import http from 'http'
import socketIo from 'socket.io'

import configureClients from './clients'
import configureServers from './servers'
import { connect as connectRedis } from './lib/redis'

import { PORT } from './config.json'

const start = async () => {
  const httpServer = http.createServer()
  const io = socketIo(httpServer)

  await connectRedis()

  configureClients(io)
  configureServers(io)

  httpServer.listen(PORT, () => {
    console.log('Websocket server listenning on ', PORT)
  })
}

start()
