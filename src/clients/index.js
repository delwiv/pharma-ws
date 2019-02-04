export default io => {
  const clients = io.of('/clients')

  clients.on('connection', socket => {
    console.log('clients::connection', socket.id)
    // socket.on('serverUid', async serverUid => {})
  })
}
