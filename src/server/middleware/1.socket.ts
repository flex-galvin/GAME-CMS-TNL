import { Server as SocketServer } from 'socket.io'
import type { Server } from 'http'
import SocketHandler from '../socket'

declare global {
  var IO : SocketServer
}

function buildCorsList(domain : string) {
  const protocols = ["http", "https"]
  const prefixes = ["", "game.", "play."]
  const corsList = []
  for (const proto of protocols) {
    for (const prefix of prefixes) {
      corsList.push(`${proto}://${prefix}${domain}`)
    }
  }
  return corsList
}

export default defineEventHandler(async (event) => {
  if(!global.IO){
    const runtimeConfig = useRuntimeConfig()
    const corsOrigins = !!runtimeConfig.dev ? '*' : buildCorsList(runtimeConfig.public.domain)
    const httpServer = (event.node.req.socket as any).server as Server

    if(!!httpServer){
      const io = new SocketServer(httpServer, {
        cors: {
          origin: corsOrigins
        }
      })
      global.IO = io
      SocketHandler(global.IO)
    }
  }
})