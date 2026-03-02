import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { UserHeader } from '@/src/components/UserHeader';
import { useAuth } from '@/src/contexts/AuthContext';
import { theme } from '@/src/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/(auth)/login" />;
  const colorScheme = useColorScheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <View style={{ flex: 1 }}>
      <UserHeader />
      <View style={{ flex: 1 }}>
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
        name="alertas"
        options={{
          title: 'Lembretes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="servicos"
        options={{
          title: 'Serviços',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bag" color={color} />,
        }}
      />
    </Tabs>
      </View>
    </View>
  );
}
