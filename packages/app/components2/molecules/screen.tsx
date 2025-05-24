import { ScrollView } from 'app/components/utils/virtual-lists';
import { ReactNode } from 'react';
import { Platform, ScrollViewProps } from 'react-native';

export const Screen = ({
  children,
  scrollViewProps = {},
}: {
  children: ReactNode;
  scrollViewProps?: ScrollViewProps;
}) => {
  return Platform.select({
    native: <ScrollView {...scrollViewProps}>{children}</ScrollView>,
    web: children,
  });
};
