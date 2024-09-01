import type { Config } from '@vlcn.io/ws-client'
import { defaultConfig } from '@vlcn.io/ws-client'
import { start } from '@vlcn.io/ws-client/worker.js'
import { createDbProvider } from '@vlcn.io/ws-browserdb'

export const config: Config = {
  dbProvider: createDbProvider(),
  transportProvider: defaultConfig.transportProvider,
}

start(config)
