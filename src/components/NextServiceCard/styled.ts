import styled from 'styled-components/native';

export const Card = styled.View`
  border-radius: 12px;
  padding: 14px;
  border-width: 1px;
  background-color: ${(p) => p.theme.tintMuted};
  border-color: ${(p) => p.theme.buttonBackground};
`;

export const Badge = styled.View<{ $color?: string }>`
  align-self: flex-start;
  padding-vertical: 6px;
  padding-horizontal: 12px;
  border-radius: 18px;
  background-color: ${(p) => p.$color ?? p.theme.textSecondary};
  margin: 12px 0;
`;

export const ServiceCard = styled(Card)<{ $border?: string; $bg?: string }>`
  border-color: ${(p) => p.$border || p.theme.buttonBackground};
  background-color: ${(p) => p.$bg || p.theme.tintMuted};
  margin-bottom: 24px;
`;

export const TitleText = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const BadgeText = styled.Text<{ $color?: string }>`
  color: ${(p) => (p.$color ? (p.$color === '#fff' ? '#000' : '#000') : p.theme.text)};
  font-weight: 700;
`;

export const DateText = styled.Text`
  color: ${(p) => p.theme.icon};
`;

export const RemainingText = styled.Text`
  color: ${(p) => p.theme.text};
  font-weight: 600;
`;

export const Content = styled.View`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

