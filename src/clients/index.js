import { clientSaveSocket } from '../lib/redis.js'

export default io => {
  const clients = io.of('/clients')

  clients.on('connection', socket => {
    console.log('clients::connection', socket.id)
    socket.on('sessionId', async (sessionId, ack) => {
      console.log('save session ', sessionId, socket.id)
      await clientSaveSocket(sessionId, socket.id)
      ack()
    })

    socket.on('*', () => console.info)
    socket.on('chatMessage', async ({ from, to, message }) => {
      console.log('chatMessage', { from, to, message })
    })
  })
}
