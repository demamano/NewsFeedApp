import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StoriesStackParamList } from './types';
import { StoryListScreen } from '../features/stories/StoryListScreen';
import { StoryDetailScreen } from '../features/detail/StoryDetailScreen';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator<StoriesStackParamList>();

export function StoriesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.bg },
      }}>
      <Stack.Screen
        name="StoryList"
        component={StoryListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StoryDetail"
        component={StoryDetailScreen}
        options={{ title: 'Story' }}
      />
    </Stack.Navigator>
  );
}
