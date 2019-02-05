import { clientGetSocket } from '../lib/redis'

export default io => {
  const servers = io.of('/servers')

  servers.on('connection', socket => {
    console.log('servers::connection', socket.id)
    socket.on('frontMessage', async ({ sessionId, type, ...data }) => {
      console.log({ sessionId, type, data })
      const clientSocketId = await clientGetSocket(sessionId)
      io.of('/clients').sockets[clientSocketId].emit(type, data)
    })
  })
}
