import { useEffect, useState } from 'react';
import { useColorScheme } from 'app/hooks/color-scheme';
import { storage } from 'app/infra/storage';

export function useColorSchemeBootstrap() {
  const [ready, setReady] = useState(false);
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    (async () => {
      const stored = await storage.getItem('theme');
      const resolved =
        stored === 'dark' ? 'dark' : colorScheme === 'dark' ? 'dark' : 'light';

      if (resolved !== colorScheme) {
        setColorScheme(resolved);
      }
      setReady(true);
    })();
  }, []);

  return ready;
}
