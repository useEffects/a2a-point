import { useEffect, useRef, useState } from 'react';
import { View, LayoutRectangle, Platform, Dimensions } from 'react-native';

interface IntersectionOptions {
  rootMargin?: number;
  threshold?: number; // [0, 1] — percentage of visibility required
  interval?: number; // optional poll interval in ms
}

export const useIntersectionObserver = (
  options: IntersectionOptions = {},
): [React.RefObject<View>, boolean] => {
  const ref = useRef<View>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { rootMargin = 0, threshold = 0.5, interval = 300 } = options;

  const checkVisibility = () => {
    if (!ref.current || !('measureInWindow' in ref.current)) return;

    ref.current.measureInWindow((x, y, width, height) => {
      const screenHeight =
        Platform.OS === 'web'
          ? window.innerHeight
          : Dimensions.get?.('window')?.height || 800;

      const visibleHeight = Math.min(screenHeight, y + height) - Math.max(0, y);
      const ratio = visibleHeight / height;

      setIsVisible(ratio >= threshold);
    });
  };

  useEffect(() => {
    const id = setInterval(checkVisibility, interval);
    return () => clearInterval(id);
  }, []);

  return [ref, isVisible];
};
