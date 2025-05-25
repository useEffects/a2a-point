import { ScrollView } from 'app/components/utils/virtual-lists';
import { ReactNode } from 'react';
import { ScrollViewProps } from 'react-native';

export const Screen = ({
  children,
  scrollViewProps = {},
}: {
  children: ReactNode;
  scrollViewProps?: ScrollViewProps;
}) => {
  return <ScrollView {...scrollViewProps}>{children}</ScrollView>;
};
