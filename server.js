/* eslint-disable node/prefer-global/process */

import * as http from 'node:http'
import fs from 'node:fs'
import express from 'express'
import ViteExpress from 'vite-express'
import { attachWebsocketServer } from '@vlcn.io/ws-server'

const PORT = Number.parseInt(process.env.PORT || '3000')

const app = express()
const server = http.createServer(app)

const DB_PATH = process.env.DB_PATH || './dbs'

// create a folder for the database if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true })
}

const wsConfig = {
  dbFolder: DB_PATH,
  schemaFolder: './src/schemas',
  pathPattern: /\/sync/,
}

attachWebsocketServer(server, wsConfig)

server.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log('info', `listening on http://localhost:${PORT} 🚀`))

ViteExpress.bind(app, server)
