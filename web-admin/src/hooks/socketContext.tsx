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

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  const connect = () => {
    const socket = io(url, { query: {} });
    setSocket(socket.connect());
    console.log('conect with socket privider....');
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
    }
    // setSocket(undefined);
  };

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
