import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import { RootTabParamList } from './types';
import { StoriesStack } from './StoriesStack';
import { BookmarksScreen } from '../features/bookmarks/BookmarksScreen';
import { StatusIcon } from '../components/StatusIcon';
import { colors } from '../theme/theme';

const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
    notification: colors.accent,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { color: colors.text, fontWeight: '700' },
          tabBarStyle: {
            backgroundColor: colors.bg,
            borderTopColor: colors.border,
            borderTopWidth: StyleSheet.hairlineWidth,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: { fontWeight: '600' },
        }}>
        <Tab.Screen
          name="FeedTab"
          component={StoriesStack}
          options={{
            headerShown: false,
            title: 'Feed',
            tabBarIcon: ({ color, size }) => (
              <StatusIcon glyph="chevron" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="BookmarksTab"
          component={BookmarksScreen}
          options={{
            headerShown: false,
            title: 'Bookmarks',
            tabBarIcon: ({ color, size }) => (
              <StatusIcon glyph="bookmark-filled" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
