import 'dotenv/config'

import uuid from 'uuid/v4'
import { join } from 'path'
import { promises } from 'fs'

const { writeFile } = promises

const { NODE_ENV } = process.env

const config = {
  NODE_ENV,
  PORT: process.env.PORT,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  SESSION_MAX_AGE: process.env.SESSION_MAX_AGE || 60 * 60 * 24 * 7,
  SESSION_SECRET: process.env.SESSION_SECRET || uuid(),
}

const getPath = () => {
  const path = [__dirname]
  if (NODE_ENV === 'production') path.push('build')
  else path.push('src')
  path.push('config.json')
  return path
}

const configure = async () => {
  console.log(`Writing config ${JSON.stringify(config)} on API...`)
  await writeFile(join(...getPath()), JSON.stringify(config, null, 2))
  console.log('Done :-)')
  process.exit(0)
}

configure()
