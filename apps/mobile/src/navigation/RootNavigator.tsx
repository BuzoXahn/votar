import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/auth.store';
import { getTokens } from '../utils/storage';
import { AuthNavigator } from './AuthNavigator';
import { SetupNavigator } from './SetupNavigator';
import { MainNavigator } from './MainNavigator';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { isAuthenticated, isNewUser } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const [hasTokens, setHasTokens] = useState(false);

  useEffect(() => {
    getTokens().then(t => {
      setHasTokens(!!t);
      if (t) useAuthStore.setState({ isAuthenticated: true });
    }).finally(() => setChecking(false));
  }, []);

  if (checking) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : isNewUser ? (
          <Stack.Screen name="Setup" component={SetupNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
