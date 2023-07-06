import React, { createContext, useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';

const url =
  String(process.env.NEXT_PUBLIC_BACKEND_URL) || 'http://localhost:3001';

const SocketContext = createContext<{
  socket: SocketIOClient.Socket | any;
  connect?: () => void;
  disconnect?: () => void;
}>({ socket: null });

const SocketProvider = ({ children }: any) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  const connect = () => {
    const sockets = io(url, { query: {} });
    setSocket(sockets.connect());
    console.log('conect with socket privider....');
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
    }
    // setSocket(undefined);
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider
      value={{
        socket,
        connect,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => useContext(SocketContext);

export { SocketProvider, useSocket };
