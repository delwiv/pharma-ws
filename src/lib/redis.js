import ioredis from 'ioredis'

import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '../config.json'

const EXPIRE = 60 * 60 * 24 * 7 // 7 days

let redis = null

export const connect = async () => {
  console.log(`Connection to redis://${REDIS_HOST}...`)
  redis = await ioredis.createClient({
    port: REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASSWORD || undefined,
  })
  console.log('Connected to redis')
}

export const set = async (key, data, expire = EXPIRE, title = 'data') => {
  await redis.hmset(key, title, typeof data === 'object' ? JSON.stringify(data) : data)
  await redis.expire(key, expire)
}

export const get = async (key, title = 'data') => {
  const data = await redis.hget(key, title)
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

export const del = (key, title = 'data') => {
  return redis.hdel(key, title)
}

export const clientSaveSocket = (clientSessionId, socketId) =>
  set(`clients::clientSessionId.socketId:${clientSessionId}`, socketId)

export const clientGetSocket = clientSessionId => get(`clients::clientSessionId.socketId:${clientSessionId}`)

export default redis
