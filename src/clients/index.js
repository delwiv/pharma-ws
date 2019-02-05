import { clientSaveSocket } from '../lib/redis'

export default io => {
  const clients = io.of('/clients')

  clients.on('connection', socket => {
    console.log('clients::connection', socket.id)
    socket.on('sessionId', async (sessionId, ack) => {
      console.log('save session ', sessionId, socket.id)
      await clientSaveSocket(sessionId, socket.id)
      ack()
    })
  })
}
