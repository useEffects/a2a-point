import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ProfileScreen as ProfileScreenBase,
  ProfileScreenHeader,
} from 'app/screens/profile';
import userStore from 'app/store/user';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';

const Stack = createNativeStackNavigator();

function ProfileScreenComponent() {
  const { user, company, document } = userStore();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      header: () => <ProfileScreenHeader user={user} />,
    });
  }, [navigation]);
  return (
    <View className="flex-1">
      <ProfileScreenBase user={user} company={company} document={document} />
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
