export * from './model'
export * from './utils'

declare module "socket.io" {
  interface Socket {
    authID: any
  }
}