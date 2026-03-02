import styled from 'styled-components/native';

export const AuthContainer = styled.View<{ $paddingTop?: number; $paddingBottom?: number }>`
  flex: 1;
  background-color: ${(p) => p.theme.background};
  padding-top: ${(p) => p.$paddingTop ?? 0}px;
  padding-bottom: ${(p) => p.$paddingBottom ?? 0}px;
  padding-horizontal: 24px;
`;

export const AuthScroll = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1 },
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
})``;

export const AuthTopBar = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const BackButton = styled.Pressable`
  padding: 8px;
  margin-left: -8px;
`;

export const AuthHeader = styled.View`
  margin-bottom: 20px;
`;

export const AuthTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${(p) => p.theme.text};
  margin-bottom: 4px;
`;

export const AuthSubtitle = styled.Text`
  font-size: 14px;
  color: ${(p) => p.theme.textSecondary};
  line-height: 20px;
`;

export const AuthForm = styled.View`
  gap: 10px;
  margin-bottom: 16px;
`;

export const AuthInput = styled.TextInput<{ $error?: boolean }>`
  border-width: 1px;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 15px;
  color: ${(p) => p.theme.text};
  border-color: ${(p) => (p.$error ? '#ef4444' : p.theme.border)};
  background-color: ${(p) => p.theme.background};
`;

export const AuthButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${(p) => p.theme.buttonBackground};
  padding-vertical: 14px;
  border-radius: 10px;
  margin-top: 4px;
`;

export const AuthButtonText = styled.Text`
  color: ${(p) => p.theme.buttonText};
  font-size: 17px;
  font-weight: 700;
`;

export const AuthLink = styled.Pressable`
  padding: 12px;
  align-items: center;
  margin-top: 4px;
`;

export const AuthLinkText = styled.Text`
  color: ${(p) => p.theme.buttonBackground};
  font-size: 16px;
  font-weight: 600;
`;

export const AuthError = styled.Text`
  color: #ef4444;
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 4px;
`;

export const FieldError = styled.Text`
  color: #ef4444;
  font-size: 11px;
  margin-top: -4px;
`;

export const BatalhaoTrigger = styled.Pressable<{ $error?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-radius: 10px;
  padding: 12px 14px;
  border-color: ${(p) => (p.$error ? '#ef4444' : p.theme.border)};
  background-color: ${(p) => p.theme.background};
`;

export const BatalhaoTriggerText = styled.Text<{ $placeholder?: boolean }>`
  font-size: 15px;
  color: ${(p) => (p.$placeholder ? '#9CA3AF' : p.theme.text)};
`;

export const BatalhaoList = styled.View`
  margin-top: 4px;
  border-width: 1px;
  border-radius: 10px;
  border-color: ${(p) => p.theme.border};
  overflow: hidden;
`;

export const BatalhaoOption = styled.Pressable<{ $selected?: boolean }>`
  padding: 12px 14px;
  background-color: ${(p) => (p.$selected ? p.theme.tintMuted : 'transparent')};
`;

export const BatalhaoOptionText = styled.Text<{ $selected?: boolean }>`
  font-size: 16px;
  color: ${(p) => (p.$selected ? p.theme.buttonBackground : p.theme.text)};
  font-weight: ${(p) => (p.$selected ? '600' : 'normal')};
`;
