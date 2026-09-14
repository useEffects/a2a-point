import { View } from 'react-native';
import { Separator } from './ui/separator';
import { SeparatorRootProps } from './primitives/separator/types';
import { cn } from 'app/lib/utils';
import { ReactNode } from 'react';

export const SeparatorText = (props: {
  wrapperClassName?: string;
  separatorProps?: SeparatorRootProps;
  separatorClassName?: string;
  children: ReactNode;
  hideLeft?: boolean;
  hideRight?: boolean;
}) => {
  return (
    <View
      className={cn(
        'flex-row w-full gap-4 items-center',
        props.wrapperClassName,
      )}
    >
      {!props.hideLeft && (
        <Separator
          {...props.separatorProps}
          className={cn('flex-1', props.separatorClassName)}
        />
      )}
      {props.children}
      {!props.hideRight && (
        <Separator
          {...props.separatorProps}
          className={cn('flex-1', props.separatorClassName)}
        />
      )}
    </View>
  );
};
