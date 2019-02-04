import redis from '../lib/redis'

export default io => {
  const servers = io.of('/servers')

  servers.on('connection', socket => {
    console.log('servers::connection', socket.id)
  })
}
