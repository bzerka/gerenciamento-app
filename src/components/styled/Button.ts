import styled from 'styled-components/native';

export const PrimaryButton = styled.TouchableOpacity`
  padding-horizontal: 16px;
  padding-vertical: 10px;
  border-radius: 8px;
  background-color: ${(p) => p.theme.buttonBackground};
  align-items: center;
  justify-content: center;
`;

export const PrimaryButtonText = styled.Text`
  color: ${({ theme }) => theme.buttonText};
  font-weight: 600;
`;

export const PrimaryButtonLarge = styled.TouchableOpacity`
  padding: 16px;
  border-radius: 10px;
  background-color: ${(p) => p.theme.buttonBackground};
  align-items: center;
`;

export const PrimaryButtonLargeText = styled.Text`
  color: ${({ theme }) => theme.buttonText};
  font-weight: 600;
  font-size: 16px;
`;

export const TouchableText = styled.TouchableOpacity`
  padding: 8px;
`;

export const TurnoOption = styled.TouchableOpacity<{ $selected?: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${(p) => p.theme.border};
  align-items: center;
  background-color: ${(p) => (p.$selected ? p.theme.tintMuted : 'transparent')};
`;
