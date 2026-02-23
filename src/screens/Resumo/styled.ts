import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${(p) => p.theme.background};
`;

export const Title = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
`;

export const Card = styled.View`
  padding: 28px;
  background-color: ${(p) => p.theme.cardBackground};
  border-radius: 12px;
  margin-bottom: 12px;
`;

export const CardText = styled.Text<{ $marginBottom?: number }>`
  color: ${(p) => p.theme.icon};
  font-size: 16px;
  margin-bottom: ${(p) => p.$marginBottom ?? 0}px;
`;

export const CardTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
`;

export const List = styled.View`
  padding-horizontal: 0px;
`;

export const EscalaCard = styled.View`
  background-color: ${(p) => p.theme.cardBackground};
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
`;

export const EscalaCardMain = styled.View`
  padding: 12px;
`;

export const MetaText = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 12px;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${(p) => p.theme.border};
  margin-vertical: 12px;
`;

export const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const LegendColor = styled.View<{ $color?: string }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  border-width: 2px;
  border-color: ${(p) => p.$color ?? p.theme.textSecondary};
`;

export const Badge = styled.View<{ $bg?: string }>`
  align-self: flex-start;
  background-color: ${(p) => (p.$bg ? `${p.$bg}66` : p.theme.textSecondary)};
  padding-vertical: 6px;
  padding-horizontal: 10px;
  border-radius: 8px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.06);
`;

export const BadgeText = styled.Text`
  color: ${(p) => p.theme.text};
  font-weight: 700;
`;

export const SmallText = styled.Text`
  color: ${(p) => p.theme.textSecondary};
`;

export const SmallTextRight = styled(SmallText)`
  text-align: right;
  align-self: stretch;
  margin: 4px 0 12px 0;
  color: ${(p) => p.theme.icon};
`;

export const ToggleButton = styled.Pressable<{ $active?: boolean; $activeColor?: string }>`
  border-width: 1px;
  border-color: ${(p) => (p.$active ? p.$activeColor ?? '#2EB866' : p.theme.textSecondary)};
  padding: 12px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  background-color: ${(p) => (p.$active ? p.theme.tintMuted : 'transparent')};
`;

export const ToggleCircle = styled.View<{ $checked?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  border-width: 2px;
  border-color: ${(p) => (p.$checked ? '#2EB866' : p.theme.textSecondary)};
  align-items: center;
  justify-content: center;
`;

export const ToggleText = styled.Text<{ $active?: boolean }>`
  color: ${(p) => (p.$active ? '#2EB866' : p.theme.textSecondary)};
  font-weight: 600;
`;

export const ToggleCircleInner = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #2EB866;
`;

// Layout helpers
export const StatRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const StatLabelRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const StatValue = styled.Text`
  color: ${(p) => p.theme.text};
  font-weight: 600;
  font-size: 16px;
`;

export const ProgressOuter = styled.View`
  height: 12px;
  background-color: ${(p) => p.theme.formButtonBackground};
  border-radius: 6px;
  margin-top: 10px;
`;

export const ProgressInner = styled.View<{ $widthPercent?: number }>`
  width: ${(p) => (p.$widthPercent != null ? `${p.$widthPercent}%` : '0%')};
  height: 100%;
  background-color: ${(p) => p.theme.buttonBackground};
  border-radius: 6px;
`;

export const TypesRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const TypeItem = styled.View`
  align-items: center;
  flex: 1;
`;

export const TypeCount = styled.Text<{ $color?: string }>`
  color: ${(p) => p.$color ?? p.theme.text};
  font-weight: 700;
  font-size: 20px;
`;

export const TypeLabel = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 12px;
  margin-top: 6px;
  text-align: center;
`;

export const EscalaHeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BadgeWrapper = styled.View`
  margin-top: 8px;
`;

export const MetaWrapper = styled.View`
  margin-top: 10px;
`;

export const ToggleWrapper = styled.View`
  margin-top: 12px;
`;

export const PaymentStatusContainer = styled.View`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 8px 0;
`