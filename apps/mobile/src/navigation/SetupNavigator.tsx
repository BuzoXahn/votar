import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfessionScreen } from '../screens/setup/ProfessionScreen';
import { AvatarScreen } from '../screens/setup/AvatarScreen';

const Stack = createNativeStackNavigator();

export function SetupNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="Profession" component={ProfessionScreen} />
      <Stack.Screen name="Avatar" component={AvatarScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}
