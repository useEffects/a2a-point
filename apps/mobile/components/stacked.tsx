import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { ReactNode } from 'react';

const Stack = createNativeStackNavigator();

interface StackedProps {
  children: ReactNode;
  header?: (props: any) => ReactNode;
  shouldWrap?: boolean;
}

export const Stacked = ({
  header,
  children,
  shouldWrap = true,
}: StackedProps) => {
  const WrappedComponent = () => (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{children}</ScrollView>
  );

  return (
    <Stack.Navigator initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{ header: header }}
        component={shouldWrap ? WrappedComponent : () => children}
      />
    </Stack.Navigator>
  );
};
