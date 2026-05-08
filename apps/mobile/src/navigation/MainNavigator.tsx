import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/polls/HomeScreen';
import { PollDetailScreen } from '../screens/polls/PollDetailScreen';
import { VoteScreen } from '../screens/polls/VoteScreen';
import { ResultsScreen } from '../screens/polls/ResultsScreen';
import { OfficialsScreen } from '../screens/officials/OfficialsScreen';
import { OfficialDetailScreen } from '../screens/officials/OfficialDetailScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { colors, font } from '../theme';

// Stacks
const PollsStack = createNativeStackNavigator();
function PollsNavigator() {
  return (
    <PollsStack.Navigator screenOptions={{ headerShown: false }}>
      <PollsStack.Screen name="Home" component={HomeScreen} />
      <PollsStack.Screen name="PollDetail" component={PollDetailScreen} options={{ animation: 'slide_from_right' }} />
      <PollsStack.Screen name="Vote" component={VoteScreen} options={{ animation: 'slide_from_bottom' }} />
      <PollsStack.Screen name="Results" component={ResultsScreen} options={{ animation: 'slide_from_right' }} />
      <PollsStack.Screen name="OfficialDetail" component={OfficialDetailScreen} options={{ animation: 'slide_from_right' }} />
    </PollsStack.Navigator>
  );
}

const OfficialsStack = createNativeStackNavigator();
function OfficialsNavigator() {
  return (
    <OfficialsStack.Navigator screenOptions={{ headerShown: false }}>
      <OfficialsStack.Screen name="OfficialsList" component={OfficialsScreen} />
      <OfficialsStack.Screen name="OfficialDetail" component={OfficialDetailScreen} options={{ animation: 'slide_from_right' }} />
    </OfficialsStack.Navigator>
  );
}

// Tab Bar
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  PollsTab: '🗳', OfficialsTab: '🏛', ProfileTab: '👤',
};

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>
            {TAB_ICONS[route.name]}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="PollsTab" component={PollsNavigator} options={{ tabBarLabel: 'Votar' }} />
      <Tab.Screen name="OfficialsTab" component={OfficialsNavigator} options={{ tabBarLabel: 'Funcionarios' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#141412',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 6,
    height: 60,
  },
  tabLabel: { fontFamily: font.medium, fontSize: 10 },
});
