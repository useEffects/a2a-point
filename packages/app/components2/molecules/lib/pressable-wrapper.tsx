import { Pressable } from 'app/components/pressable';
import { FC } from 'react';
import { PressableProps } from 'react-native';
import { RequireFields } from 'app/lib/helpers';

export const pressableWrapper = <T,>(
  pressableProps: RequireFields<PressableProps, 'onPress'>,
  Component: FC<T>,
) => {
  return (item: T & JSX.IntrinsicAttributes & { id: string }) => (
    <Pressable {...pressableProps} className="active:bg-accent">
      <Component {...item} />
    </Pressable>
  );
};
