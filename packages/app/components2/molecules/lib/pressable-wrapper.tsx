import { Pressable } from 'app/components/pressable';
import { FC } from 'react';

export const pressableWrapper = <T,>(
  onPress: (param: T) => void,
  Component: FC<T>,
) => {
  return (item: T & JSX.IntrinsicAttributes & { id: string }) => (
    <Pressable onPress={() => onPress(item)}>
      <Component {...item} />
    </Pressable>
  );
};
