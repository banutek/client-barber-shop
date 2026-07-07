import { io, type Socket } from 'socket.io-client'

const SOCKET_URL: string =
  import.meta.env.VITE_API_URL?.replace('/api/v1', '') ?? 'http://localhost:4200'

let socket: Socket | null = null

export function connectSocket(): Socket {
  if (!socket?.connected) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    })
  }
  return socket
}

export function getSocket(): Socket | null {
  return socket
}

export function disconnectSocket(): void {
  socket?.disconnect()
  socket = null
}
