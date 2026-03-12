import React from 'react';
import { Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getStoreUrl } from '@/src/constants/app-store';
import { useTheme } from 'styled-components/native';
import {
  Container,
  Description,
  IconWrapper,
  Title,
  UpdateButton,
  UpdateButtonText,
} from './styled';

export default function ForceUpdateScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const openStore = () => {
    const platform = Platform.OS === 'android' ? 'android' : 'ios';
    Linking.openURL(getStoreUrl(platform)).catch(() => {});
  };

  return (
    <Container style={{ paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }}>
      <IconWrapper>
        <IconSymbol name="arrow.down.circle.fill" size={48} color={theme.buttonBackground} />
      </IconWrapper>
      <Title>Atualização necessária</Title>
      <Description>
        Uma nova versão do app está disponível. Atualize para continuar usando o Escala Pro.
      </Description>
      <UpdateButton onPress={openStore}>
        <UpdateButtonText>Atualizar agora</UpdateButtonText>
      </UpdateButton>
    </Container>
  );
}
