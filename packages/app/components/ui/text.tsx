import * as Slot from 'app/components/primitives/slot';
import type { SlottableTextProps, TextRef } from 'app/components/primitives/types';
import { cn } from 'app/lib/utils';
import * as React from 'react';
import { Text as RNText } from "react-native";

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn('text-base text-foreground', textClass, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

export { Text, TextClassContext };
