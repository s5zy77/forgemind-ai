import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Asset } from '../../../shared/types';

interface SocketContextType {
  socket: Socket | null;
  liveAssets: Asset[];
}

const SocketContext = createContext<SocketContextType>({ socket: null, liveAssets: [] });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [liveAssets, setLiveAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const s = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });

    s.on('telemetry_update', (updated: Asset[]) => {
      setLiveAssets(updated);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, liveAssets }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
