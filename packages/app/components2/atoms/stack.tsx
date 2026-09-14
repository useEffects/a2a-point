import { cn } from 'app/lib/utils';
import { ReactNode } from 'react';
import { View } from 'react-native';

type StackProps = {
  children: ReactNode;
  size?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'vertical' | 'horizontal';
  className?: string;
};

const sizeToGap: Record<NonNullable<StackProps['size']>, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-4',
  md: 'gap-8',
  lg: 'gap-12',
  xl: 'gap-16',
};

export const Stack = ({
  children,
  size = 'md',
  variant = 'vertical',
  className = '',
}: StackProps) => {
  const gapClass = sizeToGap[size];
  const directionClass = variant === 'horizontal' ? 'flex-row' : 'flex-col';

  return (
    <View className={cn('flex', directionClass, gapClass, className)}>
      {children}
    </View>
  );
};
