import styled from 'styled-components/native';

const CARD_BG = '#2C2C2C';
const INPUT_BG = '#1F1F1F';
const ACCENT_BLUE = '#155DFC';

export const AuthContainer = styled.View<{ $paddingTop?: number; $paddingBottom?: number }>`
  flex: 1;
  background-color: #1A1A1A;
  padding-top: ${(p) => p.$paddingTop ?? 0}px;
  padding-bottom: ${(p) => p.$paddingBottom ?? 0}px;
  padding-horizontal: 24px;
`;

export const AuthScroll = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
})``;

export const BrandingWrapper = styled.View`
  align-items: center;
  margin-bottom: 32px;
`;

export const LogoBox = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background-color: ${ACCENT_BLUE};
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const BrandTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 4px;
`;

export const BrandSubtitle = styled.Text`
  font-size: 14px;
  color: #9CA3AF;
`;

export const FormCard = styled.View`
  width: 100%;
  max-width: 400px;
  background-color: ${CARD_BG};
  border-radius: 16px;
  padding: 24px;
`;

export const FormHeader = styled.View`
  margin-bottom: 20px;
`;

export const FormTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 4px;
`;

export const FormSubtitle = styled.Text`
  font-size: 14px;
  color: #9CA3AF;
  line-height: 20px;
`;

export const AuthForm = styled.View`
  gap: 16px;
`;

export const InputGroup = styled.View`
  gap: 6px;
`;

export const InputLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
`;

export const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${INPUT_BG};
  border-radius: 10px;
  border-width: 1px;
  border-color: transparent;
`;

export const AuthInput = styled.TextInput`
  flex: 1;
  padding: 12px 14px;
  font-size: 15px;
  color: #FFFFFF;
`;

export const PasswordToggle = styled.Pressable`
  padding: 12px 14px;
`;

export const AuthButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${ACCENT_BLUE};
  padding-vertical: 14px;
  border-radius: 10px;
  margin-top: 8px;
`;

export const AuthButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 17px;
  font-weight: 700;
`;

export const AuthLinkWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 24px;
`;

export const AuthLinkText = styled.Text`
  font-size: 15px;
  color: #9CA3AF;
`;

export const AuthLink = styled.Pressable`
  padding: 4px;
`;

export const AuthLinkHighlight = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${ACCENT_BLUE};
`;

export const AuthError = styled.Text`
  color: #ef4444;
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 4px;
`;
