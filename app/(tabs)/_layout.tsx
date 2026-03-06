import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/src/contexts/AuthContext';
import { theme } from '@/src/theme';
import { useEffectiveTheme } from '@/src/theme/ThemeProvider';

export default function TabLayout() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const mode = useEffectiveTheme();

  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme[mode].buttonBackground,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      /> 
      <Tabs.Screen
        name="resumo"
        options={{
          title: 'Resumo',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notas"
        options={{
          title: 'Notas',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="note.text" color={color} />,
        }}
      />
      <Tabs.Screen
        name="servicos"
        options={{
          title: 'Serviços',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="conta"
        options={{
          title: 'Conta',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
    </View>
  );
}
