import * as Slot from 'app/components/primitives/slot';
import type { SlottableTextProps, TextRef } from 'app/components/primitives/types';
import { cn } from 'app/lib/utils';
import * as React from 'react';
import { Text as RNText } from "react-native";

const TextClassContext = React.createContext<string | undefined>(undefined);

const poppinsFontMap = {
  'font-thin': 'Poppins_100Thin',
  'font-thin-italic': 'Poppins_100Thin_Italic',
  'font-extralight': 'Poppins_200ExtraLight',
  'font-extralight-italic': 'Poppins_200ExtraLight_Italic',
  'font-light': 'Poppins_300Light',
  'font-light-italic': 'Poppins_300Light_Italic',
  'font-normal': 'Poppins_400Regular',
  'font-normal-italic': 'Poppins_400Regular_Italic',
  'font-medium': 'Poppins_500Medium',
  'font-medium-italic': 'Poppins_500Medium_Italic',
  'font-semibold': 'Poppins_600SemiBold',
  'font-semibold-italic': 'Poppins_600SemiBold_Italic',
  'font-bold': 'Poppins_700Bold',
  'font-bold-italic': 'Poppins_700Bold_Italic',
  'font-extrabold': 'Poppins_800ExtraBold',
  'font-extrabold-italic': 'Poppins_800ExtraBold_Italic',
  'font-black': 'Poppins_900Black',
  'font-black-italic': 'Poppins_900Black_Italic',
};

const textSizes = ['text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl'];

const getPoppinsFontClass = (className: string) => {
  const classList = className.split(' ').map(c => c.trim());

  const hasTextSize = classList.some(c => textSizes.includes(c));
  if (!hasTextSize) return { className, style: {} };

  let modifiedClassList = [...classList];
  let fontStyle = {};

  for (const fontClass in poppinsFontMap) {
    if (classList.includes(fontClass)) {
      // Remove the original font weight class
      modifiedClassList = modifiedClassList.filter(c => c !== fontClass);
      // Set the Poppins font style
      fontStyle = {
        fontFamily: poppinsFontMap[fontClass as keyof typeof poppinsFontMap],
        fontStyle: fontClass.includes('italic') ? 'italic' : 'normal',
      };
      break; // Exit the loop once a match is found
    }
  }

  return { className: modifiedClassList.join(' '), style: fontStyle };
};

const Text = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className = "", asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;

    const combinedClassName = cn("text-base text-foreground", textClass, className);
    const { className: finalClassName, style: fontStyle } = getPoppinsFontClass(combinedClassName);

    return (
      <Component
        style={{ ...fontStyle }}
        className={finalClassName}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

export { Text, TextClassContext };
