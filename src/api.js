import openSocket from 'socket.io-client';

export default class Api {
  constructor() {
    this.socket = openSocket();
  }

  subscribe(subscriber) {
    return [
      this.socket.on('NEW_CONNECTION', id => subscriber.onNewConnection(id)),
      this.socket.on('BROADCAST', ({ id, message }) => subscriber.onBroadcast(id, message)),
      this.socket.on('MESSAGE', ({ id, message }) => subscriber.onMessage(id, message)),
      this.socket.on('DISCONNECT', id => subscriber.onDisconnect(id)),
      this.socket.on('CONNECTIONS', ids => subscriber.onConnectionList(ids));
    ];
  }

  sendBroadcast(message) {
    this.socket.emit('sendBroadcast', message);
  }

  sendMessage(id, message) {
    this.socket.emit('sendMessage', id, message);
  }

  disconnect() {
    this.socket.disconnect();
    delete this.socket;
  }
}
