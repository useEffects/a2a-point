import { useAuthFlow } from 'app/application/auth/hooks';
import { directusStore } from 'app/store/directus';
import { useEffect, useRef, useState } from 'react';
import { directusOrigin } from '../utils';

export function useWS() {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const {
    data: { isAuthenticated },
  } = useAuthFlow();
  const { rest } = directusStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    let isCancelled = false;

    rest.getToken().then((token) => {
      if (isCancelled) return;

      const ws = new WebSocket(
        `wss://${directusOrigin}/websocket?access_token=${token}`,
      );
      socketRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => setConnected(false);
      ws.onerror = () => setConnected(false);
    });

    return () => {
      isCancelled = true;
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated]);

  return { socket: socketRef.current, connected };
}
