import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${(p) => p.theme.background};
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

export const IconWrapper = styled.View`
  width: 88px;
  height: 88px;
  border-radius: 44px;
  background-color: ${(p) => p.theme.tintMuted};
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

export const Title = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
`;

export const Description = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  margin-bottom: 32px;
`;

export const UpdateButton = styled.Pressable`
  background-color: ${(p) => p.theme.buttonBackground};
  padding-vertical: 16px;
  padding-horizontal: 32px;
  border-radius: 12px;
  align-self: stretch;
  align-items: center;
`;

export const UpdateButtonText = styled.Text`
  color: ${(p) => p.theme.buttonText};
  font-size: 17px;
  font-weight: 700;
`;
