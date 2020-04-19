import { clientGetSocket } from '../lib/redis.js'

export default io => {
  const servers = io.of('/servers')

  servers.on('connection', socket => {
    console.log('servers::connection', socket.id)
    socket.on('frontMessage', async ({ sessionId, type, ...data }) => {
      console.log({ sessionId, type, data })
      const clientSocketId = await clientGetSocket(sessionId)
      io.of('/clients').sockets[clientSocketId].emit(type, data)
    })
    socket.on('newOrder', async ({ sessionId }) => {
      const clientSocketId = await clientGetSocket(sessionId)
      console.log({ clientSocketId })
      console.log({ client: io.of('/clients').sockets })
      io.of('/clients').sockets[clientSocketId].emit('newOrder', 'lol')
    })
  })
}
