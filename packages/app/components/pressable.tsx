import { ComponentProps } from 'react';
import { Pressable as RNPressable } from 'react-native';

export const Pressable = (props: ComponentProps<typeof RNPressable>) => {
  return <RNPressable {...props} />;
};
