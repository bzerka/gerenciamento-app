import styled from 'styled-components/native';

export const ScreenContainer = styled.View`
  flex: 1;
  padding: 20px;
  padding-top: 20px;
  background-color: ${(p) => p.theme.background};
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const Card = styled.View`
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  background-color: ${(p) => p.theme.tintMuted};
`;

export const CardText = styled.Text`
  color: ${(p) => p.theme.text};
  opacity: 0.9;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${(p) => p.theme.iconMuted};
`;

export const RowDate = styled.Text`
  min-width: 56px;
  font-weight: 600;
  color: ${(p) => p.theme.text};
`;

export const RowTurno = styled.Text`
  min-width: 56px;
  opacity: 0.9;
  color: ${(p) => p.theme.text};
`;

export const EmptyText = styled.Text`
  margin-top: 8px;
  opacity: 0.7;
  color: ${(p) => p.theme.text};
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const List = styled.View`
  gap: 12px;
`;

export const EscalaCard = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${(p) => p.theme.border};
`;

export const EscalaCardMain = styled.View`
  flex: 1;
`;

export const MetaText = styled.Text`
  margin-top: 4px;
  font-size: 14px;
  opacity: 0.85;
  color: ${(p) => p.theme.text};
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: ${(p) => p.theme.text};
`;

export const ScreenTitle = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: ${(p) => p.theme.text};
`;

export const Subtitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${(p) => p.theme.text};
`;

export const BodyText = styled.Text`
  font-size: 16px;
  color: ${(p) => p.theme.text};
`;

export const LinkText = styled.Text`
  font-size: 16px;
  color: ${(p) => p.theme.buttonBackground};
  line-height: 30px;
`;

export const SemiBoldText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(p) => p.theme.text};
`;

export const TurnoOptionText = styled.Text<{ $selected?: boolean }>`
  color: ${(p) => (p.$selected ? p.theme.buttonBackground : p.theme.text)};
  font-weight: ${(p) => (p.$selected ? '600' : 'normal')};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ActionButton = styled.Pressable`
  background-color: ${(p) => p.theme.buttonBackground};
  padding: 8px 12px;
  border-radius: 8px;
`;

export const EmptyCard = styled(Card)`
  align-items: center;
  padding-vertical: 28px;
  border-radius: 14px;
  background-color: ${(p) => p.theme.tintMuted};
  border-width: 1px;
  border-color: ${(p) => p.theme.border};
`;

export const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 8px;
`;

export const LegendColor = styled.View<{ $color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background-color: ${(p) => p.$color};
  margin-right: 8px;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${(p) => p.theme.iconMuted};
  margin-vertical: 12px;
`;

export const ModalBadge = styled.View`
  align-self: flex-start;
  padding-vertical: 6px;
  padding-horizontal: 12px;
  border-radius: 18px;
`;

export const Center = styled.View`
  align-items: center;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

export const InfoBlock = styled.View``;

export const InfoLabel = styled.Text`
  color: ${(p) => p.theme.icon};
`;

export const InfoValue = styled.Text`
  color: ${(p) => p.theme.text};
  font-weight: 700;
`;

export const RemoveButton = styled.Pressable`
  padding: 8px;
`;

