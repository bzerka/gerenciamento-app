import styled from 'styled-components/native';

export const Header = styled.View<{ $paddingTop?: number }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 20px;
  padding-vertical: 12px;
  padding-top: ${(p) => (p.$paddingTop ?? 0) + 12}px;
  background-color: ${(p) => p.theme.background};
  border-bottom-width: 1px;
  border-bottom-color: ${(p) => p.theme.border};
`;

export const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const Avatar = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${(p) => p.theme.tintMuted};
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${(p) => p.theme.buttonBackground};
`;

export const UserText = styled.View``;

export const UserName = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(p) => p.theme.text};
`;

export const UserSubtitle = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => p.theme.buttonBackground};
  margin-top: 2px;
`;

export const LogoutButton = styled.Pressable`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: rgba(239, 68, 68, 0.2);
  align-items: center;
  justify-content: center;
`;
