import dotenv from 'dotenv'

import uuid from 'uuid'
import { resolve } from 'path'
import { promises } from 'fs'

dotenv.config()

const { writeFile } = promises

const { NODE_ENV } = process.env

const config = {
  NODE_ENV,
  PORT: process.env.PORT || 3001,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  SESSION_MAX_AGE: process.env.SESSION_MAX_AGE || 60 * 60 * 24 * 7,
  SESSION_SECRET: process.env.SESSION_SECRET || uuid.v4()
}

const getPath = () => {
  const path = [dirname(), 'src', 'config.json']
  return path
}

const configure = async () => {
  console.log(`Writing config ${JSON.stringify(config)} on API...`)
  await writeFile(
    resolve('src', 'config.json'),
    JSON.stringify(config, null, 2)
  )
  console.log('Done :-)')
  process.exit(0)
}

configure()
