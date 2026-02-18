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
  background-color: #0e0e0e;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

export const CardText = styled.Text`
  color: #ddd;
`;

export const List = styled.View`
  padding-horizontal: 0px;
`;

export const EscalaCard = styled.View`
  background-color: #0b0b0b;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
`;

export const EscalaCardMain = styled.View`
  padding: 12px;
`;

export const MetaText = styled.Text`
  color: #888;
  font-size: 12px;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: #1a1a1a;
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
  border-color: ${(p) => p.$color ?? '#666'};
`;

export const Badge = styled.View<{ $bg?: string }>`
  align-self: flex-start;
  background-color: ${(p) => p.$bg ?? '#444'};
  padding-vertical: 6px;
  padding-horizontal: 10px;
  border-radius: 8px;
`;

export const BadgeText = styled.Text`
  color: #000;
  font-weight: 700;
`;

export const SmallText = styled.Text`
  color: #bbb;
`;

export const ToggleButton = styled.Pressable<{ $active?: boolean; $activeColor?: string }>`
  border-width: 1px;
  border-color: ${(p) => (p.$active ? p.$activeColor ?? '#2EB866' : '#333')};
  padding: 12px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  background-color: ${(p) => (p.$active ? '#0B2E18' : 'transparent')};
`;

export const ToggleCircle = styled.View<{ $checked?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  border-width: 2px;
  border-color: ${(p) => (p.$checked ? '#2EB866' : '#666')};
  align-items: center;
  justify-content: center;
`;

export const ToggleText = styled.Text<{ $active?: boolean }>`
  color: ${(p) => (p.$active ? '#2EB866' : '#DDD')};
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
  color: #fff;
  font-weight: 600;
`;

export const ProgressOuter = styled.View`
  height: 8px;
  background-color: #222;
  border-radius: 6px;
  margin-top: 10px;
`;

export const ProgressInner = styled.View<{ $widthPercent?: number }>`
  width: ${(p) => (p.$widthPercent != null ? `${p.$widthPercent}%` : '0%')};
  height: 100%;
  background-color: #0B5FFF;
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
  color: ${(p) => p.$color ?? '#fff'};
  font-weight: 700;
  font-size: 20px;
`;

export const TypeLabel = styled.Text`
  color: #aaa;
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
`