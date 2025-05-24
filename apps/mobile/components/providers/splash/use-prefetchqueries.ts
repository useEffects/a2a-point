import { useEffect, useState } from 'react';

export function usePrefetchQueries() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([]).then(() => setReady(true));
  }, []);

  return ready;
}
