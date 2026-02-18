import styled from 'styled-components/native';

// ── Calendar ──────────────────────────────────────────────────────────

export const Container = styled.View`
  flex: 1;
  background-color: ${(p) => p.theme.background};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const MonthTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
`;

export const NavButtons = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const NavButton = styled.Pressable`
  padding: 6px 10px;
`;

export const NavButtonText = styled.Text`
  color: #aaa;
  font-size: 18px;
`;

export const WeekDayText = styled.Text`
  width: 40px;
  text-align: center;
  color: ${(p) => p.theme.iconMuted};
`;

export const PlaceholderText = styled.Text`
  color: ${(p) => p.theme.text};
`;

export const WeekRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

export const CalendarRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const DayCell = styled.Pressable<{ $opacity?: number }>`
  width: ${100 / 7}%;
  padding-vertical: 10px;
  align-items: center;
  opacity: ${(p) => p.$opacity ?? 1};
`;

export const DayBox = styled.View<{ $isToday?: boolean; $borderColor?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => (p.$isToday ? '#0B5FFF' : 'transparent')};
  border-width: ${(p) => (p.$borderColor ? '2px' : '0px')};
  border-color: ${(p) => p.$borderColor ?? 'transparent'};
  position: relative;
`;

export const DayText = styled.Text<{ $isToday?: boolean; $shiftUp?: boolean }>`
  color: ${(p) => (p.$isToday ? '#FFF' : p.theme.text)};
  font-size: 16px;
  transform: ${(p) => (p.$shiftUp ? 'translateY(-6px)' : 'translateY(0px)')};
`;

export const Dot = styled.View<{ $color?: string }>`
  position: absolute;
  bottom: 8px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(p) => p.$color ?? '#888'};
`;

export const PlaceholderCard = styled.View`
  margin-top: 18px;
  padding: 16px;
  border-radius: 12px;
  background-color: ${(p) => p.theme.tintMuted};
`;

export const LegendRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

export const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 8px;
`;

export const LegendColor = styled.View<{ $color?: string }>`
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background-color: ${(p) => p.$color ?? '#666'};
  margin-right: 8px;
`;

// ── Bottom Sheet ──────────────────────────────────────────────────────

export const OverlayPressable = styled.Pressable`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.55);
`;

export const Sheet = styled.View`
  background-color: #141414;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 88%;
  elevation: 20;
  shadow-color: #000;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
`;

export const SheetContent = styled.ScrollView`
  padding-horizontal: 20px;
`;

export const SheetHandle = styled.View`
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background-color: #3a3a3a;
  align-self: center;
  margin-top: 12px;
  margin-bottom: 18px;
`;

export const SheetHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

export const SheetTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 18px;
  font-weight: 700;
  flex: 1;
`;

export const CloseButton = styled.Pressable`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #2a2a2a;
  align-items: center;
  justify-content: center;
`;

export const CloseButtonText = styled.Text`
  color: #aaa;
  font-size: 14px;
  line-height: 16px;
`;

// ── Detail View ───────────────────────────────────────────────────────

export const DetailBadge = styled.View<{ $color?: string }>`
  align-self: flex-start;
  background-color: ${(p) => p.$color ?? '#444'};
  padding-vertical: 7px;
  padding-horizontal: 14px;
  border-radius: 20px;
  margin-bottom: 16px;
`;

export const DetailBadgeText = styled.Text`
  color: #000;
  font-weight: 700;
  font-size: 14px;
`;

export const DetailSection = styled.View`
  background-color: #1c1c1c;
  border-radius: 14px;
  margin-bottom: 12px;
  overflow: hidden;
`;

export const DetailRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding: 14px 16px;
  gap: 14px;
`;

export const DetailDivider = styled.View`
  height: 1px;
  background-color: #2a2a2a;
  margin-horizontal: 16px;
`;

export const DetailIconText = styled.Text`
  font-size: 20px;
  margin-top: 1px;
`;

export const DetailInfo = styled.View`
  flex: 1;
`;

export const DetailLabel = styled.Text`
  color: #0b5fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 3px;
`;

export const DetailValue = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 16px;
  font-weight: 600;
`;

export const DetailSubValue = styled.Text`
  color: #888;
  font-size: 13px;
  margin-top: 2px;
`;

export const PaymentToggle = styled.Pressable<{ $pago?: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: #1c1c1c;
  border-radius: 14px;
  padding: 14px 16px;
  gap: 14px;
  margin-bottom: 12px;
`;

export const PaymentCircle = styled.View<{ $checked?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(p) => (p.$checked ? '#4caf50' : '#555')};
  background-color: ${(p) => (p.$checked ? '#4caf50' : 'transparent')};
  align-items: center;
  justify-content: center;
`;

export const PaymentInfo = styled.View`
  flex: 1;
`;

export const PaymentTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 15px;
  font-weight: 600;
`;

export const PaymentSubTitle = styled.Text`
  color: #777;
  font-size: 12px;
  margin-top: 2px;
`;

export const ObsBox = styled.View`
  background-color: #1c1c1c;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
`;

export const ObsText = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 14px;
  line-height: 21px;
`;

export const FullButton = styled.Pressable`
  background-color: #0b5fff;
  border-radius: 12px;
  padding: 15px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
`;

export const DangerButton = styled.Pressable`
  background-color: transparent;
  border-width: 1px;
  border-color: #c0392b;
  border-radius: 12px;
  padding: 13px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;

export const DangerButtonText = styled.Text`
  color: #e74c3c;
  font-size: 15px;
  font-weight: 600;
`;

export const FullButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 700;
`;

// ── Form ──────────────────────────────────────────────────────────────

export const FormLabel = styled.Text`
  color: ${(p) => p.theme.iconMuted};
  font-size: 13px;
  margin-top: 16px;
  margin-bottom: 6px;
`;

export const FormInput = styled.TextInput`
  background-color: #222;
  padding-vertical: 13px;
  padding-horizontal: 14px;
  border-radius: 10px;
  color: #fff;
  font-size: 15px;
`;

export const MultilineInput = styled.TextInput`
  background-color: #222;
  padding-vertical: 13px;
  padding-horizontal: 14px;
  border-radius: 10px;
  color: #fff;
  font-size: 15px;
  min-height: 90px;
  text-align-vertical: top;
`;

export const FlexOptionsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const OptionsRow = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const OptionButton = styled.Pressable<{ $selected?: boolean; $bg?: string }>`
  padding-vertical: 10px;
  padding-horizontal: 14px;
  border-radius: 8px;
  background-color: ${(p) => (p.$selected ? (p.$bg ?? '#0b5fff') : '#222')};
`;

export const OptionText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
`;

export const ErrorText = styled.Text`
  color: #f39c12;
  font-size: 12px;
  margin-top: 4px;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  margin-top: 12px;
  gap: 8px;
`;

export const PrimaryButton = styled.Pressable`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background-color: #0b5fff;
  align-items: center;
`;

export const SecondaryButton = styled.Pressable`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background-color: #333;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
`;

export const SmallText = styled.Text`
  color: ${(p) => p.theme.iconMuted};
`;

// Legacy aliases kept for any remaining usage
export const ModalDate = styled.Text`
  color: ${(p) => p.theme.iconMuted};
  margin-bottom: 6px;
`;
export const ModalSection = styled.View`
  background-color: #0b0b0b;
  padding: 12px;
  border-radius: 10px;
  margin-vertical: 8px;
`;
export const ModalBadge = styled.View<{ $color?: string }>`
  align-self: flex-start;
  background-color: ${(p) => p.$color ?? '#444'};
  padding-vertical: 6px;
  padding-horizontal: 12px;
  border-radius: 18px;
`;
export const ModalBadgeText = styled.Text`
  color: #000;
  font-weight: 700;
`;
export const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;
export const InfoBlock = styled.View``;
export const InfoLabel = styled.Text`
  color: ${(p) => p.theme.iconMuted};
`;
export const InfoValue = styled.Text`
  color: ${(p) => p.theme.text};
  font-weight: 700;
`;
