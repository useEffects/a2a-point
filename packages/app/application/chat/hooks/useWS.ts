import { useAuthFlow } from 'app/application/auth/hooks';
import { directusStore } from 'app/store/directus';
import { useEffect, useRef, useState } from 'react';
import { directusOrigin } from '../utils';
import { z } from 'zod';
import { tryCatch } from 'app/shared/utils/tryCatch';

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

      ws.addEventListener('message', async (message) => {
        const pingRes = pingSchema.safeParse(message);
        if (pingRes.success) {
          ws.send(
            JSON.stringify({
              data: { type: 'pong' },
              isTrusted: true,
            }),
          );
        }
      });
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

const pingSchema = z.object({
  data: z.object({
    type: z.literal('ping'),
  }),
  isTrusted: z.boolean(),
});
