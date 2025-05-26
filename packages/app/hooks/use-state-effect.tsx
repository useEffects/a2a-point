import { useEffect, useRef, useState } from 'react';

export function useStateEffect<T extends any>(
  initialState: T,
  onChange: (newValue: T, prevValue: T) => void,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(initialState);
  const prevRef = useRef<T>(initialState);

  useEffect(() => {
    if (prevRef.current !== state) {
      onChange(state, prevRef.current);
      prevRef.current = state;
    }
  }, [state]);

  return [state, setState];
}
