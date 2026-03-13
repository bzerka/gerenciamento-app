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
  padding: 10px 14px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const WeekDayText = styled.Text`
  flex: 1;
  text-align: center;
  color: #9CA3AF;
  font-size: 12px;
`;

export const PlaceholderText = styled.Text`
  color: ${(p) => p.theme.text};
`;

export const WeekRow = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

export const CalendarRow = styled.View`
  flex-direction: row;
  min-height: 90px;
`;

export const DayCell = styled.Pressable<{ $opacity?: number }>`
  flex: 1;
  min-height: 90px;
  align-items: stretch;
  opacity: ${(p) => p.$opacity ?? 1};
`;

export const DayBox = styled.View<{ $isToday?: boolean }>`
  flex: 1;
  min-height: 90px;
  align-items: center;
  justify-content: flex-start;
  padding: 6px;
  background-color: transparent;
  border-width: 0.5px;
  border-color: ${(p) => (p.$isToday ? '#155DFC' : p.theme.calendarBorder)};
  border-radius: 2px;
`;

export const DayNumberWrapper = styled.View<{ $isToday?: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  background-color: ${(p) => (p.$isToday ? '#155DFC' : 'transparent')};
`;

export const DayText = styled.Text<{ $isToday?: boolean }>`
  color: ${(p) => (p.$isToday ? '#FFF' : '#9CA3AF')};
  font-size: 12px;
  font-weight: 600;
`;

export const ServiceLabelsColumn = styled.View`
  flex: 1;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

export const ServiceLabel = styled.View<{ $color: string }>`
  background-color: ${(p) => p.$color};
  padding-horizontal: 6px;
  padding-vertical: 3px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

export const ServiceLabelText = styled.Text`
  color: #fff;
  font-size: 10px;
  font-weight: 700;
`;

export const PlaceholderCard = styled.View`
  margin-top: 18px;
  padding: 16px;
  border-radius: 12px;
  background-color: ${(p) => p.theme.tintMuted};
`;

export const EventChipsRow = styled.View`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

export const EventChip = styled.Pressable<{ $selected?: boolean; $color?: string }>`
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${(p) =>
    p.$selected ? (p.$color ?? p.theme.buttonBackground) : p.theme.formButtonBackground};
  border-width: 1px;
  border-color: ${(p) =>
    p.$selected ? (p.$color ?? p.theme.buttonBackground) : 'transparent'};
`;

export const EventChipText = styled.Text<{ $selected?: boolean }>`
  color: ${(p) => (p.$selected ? p.theme.buttonText : p.theme.textSecondary)};
  font-size: 13px;
  font-weight: ${(p) => (p.$selected ? '600' : '500')};
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
  max-height: 88%;
  elevation: 20;
  shadow-color: #000;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
`;

/** Superfície real do bottom sheet (onde aplicamos o raio e o background) */
export const SheetSurface = styled.View`
  background-color: ${(p) => p.theme.cardBackground};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding-top: 20px;
  overflow: hidden;
`;

export const SheetContent = styled.ScrollView`
  padding-horizontal: 20px;
`;

export const SheetHandle = styled.View`
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background-color: ${(p) => p.theme.textSecondary};
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
  color: ${(p) => p.theme.textSecondary};
  font-size: 18px;
  font-weight: 700;
  flex: 1;
`;

export const CloseButton = styled.Pressable`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${(p) => p.theme.cardBackground};
  align-items: center;
  justify-content: center;
`;

export const CloseButtonText = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 14px;
  line-height: 16px;
`;

// ── Detail View ───────────────────────────────────────────────────────

export const DetailBadgeRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 16px;
`;

export const DetailBadge = styled.View<{ $color?: string }>`
  align-self: flex-start;
  background-color: ${(p) => p.$color ?? '#444'};
  padding-vertical: 7px;
  padding-horizontal: 14px;
  border-radius: 20px;
  margin-bottom: 0;
`;

export const DetailBadgeText = styled.Text`
  color: ${(p) => p.theme.buttonText};
  font-weight: 700;
  font-size: 14px;
`;

export const DetailSection = styled.View`
  background-color: ${(p) => p.theme.cardBackground};
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
  background-color: ${(p) => p.theme.border};
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
  color: ${(p) => p.theme.textSecondary};
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 3px;
`;

export const DetailValue = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 16px;
  font-weight: 600;
`;

export const DetailSubValue = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 13px;
  margin-top: 2px;
`;

export const PaymentToggle = styled.Pressable<{ $pago?: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${(p) => p.theme.cardBackground};
  border: 0.5px solid ${(p) => p.theme.border};
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
  border-color: ${(p) => (p.$checked ? '#4caf50' : p.theme.textSecondary)};
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
  background-color: ${(p) => p.theme.buttonBackground};
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
  border-color: ${(p) => p.theme.textSecondary};
  border-radius: 12px;
  padding: 13px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;

export const DangerButtonText = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 15px;
  font-weight: 600;
`;

export const FullButtonText = styled.Text`
  color: ${(p) => p.theme.buttonText};
  font-size: 16px; 
  font-weight: 700;
`;

/** Botão "Adicionar outro serviço" — mesmo estilo do botão Adicionar (azul + texto branco) */
export const AddAnotherServiceButton = styled.Pressable`
  background-color: ${(p) => p.theme.buttonBackground};
  border-radius: 12px;
  padding: 14px 16px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;

export const AddAnotherServiceButtonText = styled.Text`
  color: ${(p) => p.theme.buttonText};
  font-size: 15px;
  font-weight: 600;
`;

/** Botão "Adicionar ocorrência" (detalhe do dia, sem ação por enquanto) */
export const AddOccurrenceButton = styled.Pressable`
  background-color: ${(p) => p.theme.formButtonBackground};
  border-width: 1px;
  border-color: ${(p) => p.theme.border};
  border-radius: 12px;
  padding: 14px 16px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;

export const AddOccurrenceButtonText = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 15px;
  font-weight: 600;
`;

export const DetailActionsRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 16px;
`;

/** Ícone de adicionar outro serviço no detalhe do dia (ao lado do badge do serviço) */
export const AddServiceIconButton = styled.Pressable`
  width: 34px;
  height: 34px;
  border-radius: 20px;
  background-color: ${(p) => p.theme.formButtonBackground};
  border: 1px solid ${(p) => p.theme.border};
  align-items: center;
  justify-content: center;
`;

export const DetailEditButton = styled.Pressable`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  background-color: ${(p) => p.theme.buttonBackground};
  align-items: center;
`;

export const DetailEditButtonText = styled.Text`
  color: ${(p) => p.theme.buttonText};
  font-weight: 700;
  font-size: 15px;
`;

export const DetailDeleteButton = styled.Pressable`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  background-color: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  align-items: center;
`;

export const DetailDeleteButtonText = styled.Text`
  color: #EF4444;
  font-weight: 600;
  font-size: 15px;
`;

// ── Form ──────────────────────────────────────────────────────────────

export const FormLabel = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 13px;
  margin-top: 16px;
  margin-bottom: 6px;
`;

export const FormInput = styled.TextInput`
  background-color: ${(p) => p.theme.formButtonBackground};
  padding: 13px 14px;
  border-radius: 10px;
  color: ${(p) => p.theme.text};
  font-size: 15px;
`;

export const TimePressable = styled.Pressable`
  background-color: ${(p) => p.theme.formButtonBackground};
  padding: 13px 14px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TimeText = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 15px;
`;

export const MultilineInput = styled.TextInput`
  background-color: ${(p) => p.theme.formButtonBackground};
  padding: 13px 14px;
  border-radius: 10px;
  color: ${(p) => p.theme.text};
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
  flex-wrap: wrap;
`;

export const OptionButton = styled.Pressable<{
  $selected?: boolean;
  $bg?: string;
  $color?: string;
  $disabled?: boolean;
  $isTurno?: boolean;
}>`
  padding-vertical: 18px;
  padding-horizontal: 14px;
  border-radius: 8px;
  background-color: ${(p) => {
    if (p.$color && p.$selected) return p.$color;
    if (p.$color) return p.theme.formButtonBackground;
    return p.$selected ? (p.$bg ?? '#0b5fff') : p.theme.formButtonBackground;
  }};
  flex-basis: ${(p) => (p.$isTurno ? 0 : '48%')};
  flex-grow: ${(p) => (p.$isTurno ? 1 : 0)};
  max-width: ${(p) => (p.$isTurno ? 'none' : '48%')};
  min-width: ${(p) => (p.$isTurno ? 0 : 'auto')};
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  opacity: ${(p) => (p.$disabled ? 0.35 : 1)};
`;

export const OptionText = styled.Text<{ $muted?: boolean }>`
  color: ${(p) => p.theme.text};
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

/* ── Alerta de preço não configurado ─────────────── */

export const PriceTipBox = styled.View`
  background-color: #2a1f0a;
  border-width: 1px;
  border-color: #6b4c12;
  border-radius: 10px;
  padding: 12px 14px;
  margin-top: 8px;
  gap: 6px;
`;

export const PriceTipRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
`;

export const PriceTipText = styled.Text`
  color: #d4a135;
  font-size: 13px;
  flex: 1;
  line-height: 18px;
`;

export const PriceTipLink = styled.Text`
  color: #f5a623;
  font-size: 13px;
  font-weight: 700;
  text-decoration-line: underline;
  margin-top: 2px;
`;

export const FormActionsRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 20px;
`;

export const FormDeleteButton = styled.Pressable`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  background-color: #EF4444;
  align-items: center;
`;

export const FormDeleteButtonText = styled.Text`
  color: #FFFFFF;
  font-weight: 600;
  font-size: 15px;
`;

export const FormSaveButton = styled.Pressable`
  flex: 2;
  flex-direction: row;
  padding: 14px;
  border-radius: 12px;
  background-color: ${(p) => p.theme.buttonBackground};
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const FormSaveButtonText = styled.Text`
  color: ${(p) => p.theme.buttonText};
  font-weight: 700;
  font-size: 15px;
`;
