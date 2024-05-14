import * as React from 'react';
import { View } from 'app/lib/styled';
import * as Slot from 'app/components/primitives/slot';
import type { SlottableViewProps, ViewRef } from 'app/components/primitives/types';
import type { SeparatorRootProps } from './types';

const Root = React.forwardRef<ViewRef, SlottableViewProps & SeparatorRootProps>(
  ({ asChild, decorative, orientation = 'horizontal', ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (
      <Component
        role={decorative ? 'presentation' : 'separator'}
        aria-orientation={orientation}
        ref={ref}
        {...props}
      />
    );
  }
);

Root.displayName = 'RootSeparator';

export { Root };