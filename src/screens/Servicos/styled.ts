import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${(p) => p.theme.background};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const HeaderTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 22px;
  font-weight: 700;
`;

export const AddButton = styled.Pressable`
  background-color: ${(p) => p.theme.cardBackground};
  border: 0.5px solid ${(p) => p.theme.icon};
  border-radius: 50px;
  padding: 12px;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const AddButtonText = styled.Text`
  color: #fff;
  font-weight: 600;
  font-size: 14px;
`;

export const List = styled.View``;

export const ServiceCard = styled.Pressable<{ $isNormal?: boolean }>`
  background-color: ${(p) => p.theme.cardBackground};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-left-radius: ${(p) => p.$isNormal ? '12px' : '0px'};
  border-bottom-right-radius: ${(p) => p.$isNormal ? '12px' : '0px'};
  padding: 14px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ServiceMain = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const ServiceInfo = styled.View``;

export const ServiceName = styled.Text`
  color: ${(p) => p.theme.text};
  font-weight: 600;
  font-size: 15px;
`;

export const ServiceSub = styled.Text`
  color: ${(p) => p.theme.buttonBackground};
  font-size: 12px;
  margin-top: 2px;
`;

export const ColorSwatch = styled.View<{ $bg?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: ${(p) => p.$bg ?? '#444'};
`;

export const IconButton = styled.Pressable`
  padding: 8px;
`;

/* ── Serviço modal (bottom sheet) ─────────────────── */

export const ServicoModalOverlay = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.55);
`;

export const ServicoModalSheet = styled.View`
  background-color: ${(p) => p.theme.cardBackground};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px 20px 40px;
  max-height: 90%;
`;

export const ServicoModalHandle = styled.View`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background-color: ${(p) => p.theme.iconMuted};
  align-self: center;
  margin-bottom: 24px;
`;

export const FormTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 14px;
`;

export const Label = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 13px;
  margin-top: 16px;
  margin-bottom: 6px;
`;

export const Input = styled.TextInput`
  background-color: ${(p) => p.theme.formButtonBackground};
  padding: 13px 14px;
  border-radius: 10px;
  color: ${(p) => p.theme.text};
  font-size: 15px;
  margin-bottom: 14px;
`;

export const ColorGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
`;

export const ColorButton = styled.Pressable<{ $bg?: string; $selected?: boolean; $disabled?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: ${(p) => p.$bg ?? '#444'};
  border-width: ${(p) => (p.$selected ? '2.5px' : '0px')};
  border-color: #fff;
  opacity: ${(p) => (p.$disabled ? 0.3 : 1)};
`;

export const ErrorText = styled.Text`
  color: #f39c12;
  font-size: 12px;
  margin-bottom: 10px;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: 10px;
`;

export const CancelButton = styled.Pressable`
  flex: 1;
  padding: 13px;
  border-radius: 10px;
  background-color: ${(p) => p.theme.formButtonBackground};
  border: 1px solid ${(p) => p.theme.border};
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 6px;
`;

export const PrimaryButton = styled.Pressable`
  flex: 1;
  padding: 13px;
  border-radius: 10px;
  background-color: ${(p) => p.theme.buttonBackground};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 6px;
`;

export const PrimaryButtonText = styled.Text<{ $color?: string }>`
  color: ${(p) => p.$color ?? p.theme.buttonText};
  font-weight: 600;
  font-size: 14px;
`;

export const ServicoDeleteButton = styled.Pressable`
  padding: 14px 20px;
  border-radius: 12px;
  background-color: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  align-items: center;
  justify-content: center;
`;

export const ServicoDeleteButtonText = styled.Text`
  color: #EF4444;
  font-weight: 600;
  font-size: 15px;
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

/* ── Modal Configurar Turnos ──────────────────────── */

export const TurnoModalSheet = styled.View`
  background-color: ${(p) => p.theme.cardBackground};
  border: 1px solid ${(p) => p.theme.border};
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
  padding: 24px 20px 40px;
`;

export const TurnoModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const TurnoModalTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 18px;
  font-weight: 700;
`;

export const TurnoModalSubtitle = styled.Text`
  color: ${(p) => p.theme.icon};
  font-size: 13px;
  margin-bottom: 20px;
  line-height: 18px;
`;

export const TurnoModalRow = styled.View`
  margin-bottom: 4px;
`;

export const TurnoModalRowHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 14px;
`;

export const TurnoModalRowLabel = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 15px;
`;

export const TurnoModalPriceCard = styled.View`
  background-color: ${(p) => p.theme.formButtonBackground};
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  padding: 13px 14px;
  margin-bottom: 8px;
  gap: 8px;
`;

export const TurnoModalPricePrefix = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 14px;
`;

export const TurnoModalPriceInput = styled.TextInput`
  flex: 1;
  color: ${(p) => p.theme.text};
  font-size: 15px;
  padding: 0;
`;

export const TurnoModalTip = styled.View`
  background-color: ${(p) => p.theme.tintMuted};
  border-radius: 10px;
  padding: 12px 14px;
  margin-top: 16px;
  margin-bottom: 20px;
`;

export const TurnoModalTipText = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 13px;
  line-height: 18px;
`;

export const TurnoModalActions = styled.View`
  flex-direction: row;
  gap: 10px;
`;

export const TurnoModalCancelBtn = styled.Pressable`
  flex: 1;
  padding: 13px;
  border-radius: 10px;
  background-color: ${(p) => p.theme.formButtonBackground};
  border: 1px solid ${(p) => p.theme.border};
  align-items: center;
`;

export const TurnoModalSaveBtn = styled.Pressable`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  background-color: ${(p) => p.theme.buttonBackground};
  align-items: center;
`;

export const TurnoModalBtnText = styled.Text<{ $color?: string }>`
  color: ${(p) => p.$color ?? p.theme.buttonText};
  font-size: 15px;
  font-weight: 600;
`;

/* ── Switch toggle ────────────────────────────────── */

export const SwitchTrack = styled.View<{ $on?: boolean }>`
  width: 46px;
  height: 26px;
  border-radius: 13px;
  background-color: ${(p) => (p.$on ? '#7BA6FF' : p.theme.cardBackground)};
  border: 1px solid ${(p) => p.theme.border};
  justify-content: center;
  padding-horizontal: 3px;
`;

export const SwitchThumb = styled.View<{ $on?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${(p) => p.theme.text};
  align-self: ${(p) => (p.$on ? 'flex-end' : 'flex-start')};
`;

/* ── Configurar turnos (sub-barra abaixo de cada serviço) ── */

export const ServiceItem = styled.View`
  margin-bottom: 10px;
`;

export const ServiceSwipeContent = styled.View``;

export const SwipeDeleteAction = styled.Pressable`
  background-color: #EF4444;
  justify-content: center;
  align-items: center;
  width: 72px;
  border-radius: 12px;
  align-self: stretch;
`;

export const TurnoConfigBar = styled.Pressable`
  background-color: ${(p) => p.theme.cardBackground};
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 10px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-top-width: 1px;
  border-top-color: ${(p) => p.theme.border};
`;

export const TurnoConfigLabel = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 13px;
`;

export const TurnoConfigEditBtn = styled.Pressable`
  padding: 2px 0px;
`;

export const TurnoConfigEditText = styled.Text`
  color: ${(p) => p.theme.buttonBackground};
  font-size: 13px;
  font-weight: 600;
`;

/* ── Escala de Trabalho card ─────────────────────── */

export const EscalaCard = styled.View`
  background-color: ${(p) => p.theme.cardBackground};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const EscalaCardTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const EscalaCardLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const EscalaCardIconBox = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: ${(p) => p.theme.tintMuted};
  align-items: center;
  justify-content: center;
`;

export const EscalaCardTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 20px;
  font-weight: 700;
`;

export const EscalaCardSub = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 13px;
  line-height: 18px;
  margin-top: 4px;
`;

export const EscalaCardConfigBtn = styled.Pressable`
  padding: 4px 0;
`;

export const EscalaCardConfigBtnText = styled.Text`
  color: ${(p) => p.theme.buttonBackground};
  font-size: 14px;
  font-weight: 600;
`;

/* ── Escala modal ────────────────────────────────── */

export const EscalaModalOverlay = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.6);
`;

export const EscalaModalSheet = styled.View`
  background-color: ${(p) => p.theme.cardBackground};
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
  padding: 24px 20px 40px;
`;

export const EscalaModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const EscalaModalTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 18px;
  font-weight: 700;
`;

export const EscalaFieldLabel = styled.Text`
  color: ${(p) => p.theme.icon};
  font-size: 13px;  
  margin-bottom: 8px;
  margin-top: 4px;
`;

export const EscalaDropdownTrigger = styled.Pressable`
  background-color: ${(p) => p.theme.formButtonBackground};
  border-radius: 10px;
  padding: 13px 14px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const EscalaDropdownText = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 15px;
  flex: 1;
`;

export const EscalaDropdownList = styled.View`
  background-color: ${(p) => p.theme.formButtonBackground};
  border-radius: 10px;
  margin-bottom: 4px;
  overflow: hidden;
`;

export const EscalaDropdownOption = styled.Pressable<{ $selected?: boolean }>`
  padding: 13px 14px;
  background-color: ${(p) => (p.$selected ? p.theme.tintMuted : 'transparent')};
`;

export const EscalaDropdownOptionText = styled.Text<{ $selected?: boolean }>`
  color: ${(p) => (p.$selected ? p.theme.buttonBackground : p.theme.textSecondary)};
  font-size: 14px;
  font-weight: ${(p) => (p.$selected ? '600' : '400')};
`;

export const EscalaDateInput = styled.TextInput`
  background-color: ${(p) => p.theme.formButtonBackground};
  border-radius: 10px;
  padding: 13px 14px;
  color: ${(p) => p.theme.text};
  font-size: 15px;
  margin-bottom: 4px;
`;

export const EscalaDatePressable = styled.Pressable`
  background-color: ${(p) => p.theme.formButtonBackground};
  color: ${(p) => p.theme.text};
  border-radius: 10px;
  padding: 13px 14px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const EscalaDateText = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 15px;
`;

export const EscalaErrorText = styled.Text`
  color: #f39c12;
  font-size: 12px;
  margin-bottom: 8px;
`;

export const EscalaDayRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const EscalaDayButton = styled.Pressable<{ $selected?: boolean }>`
  flex: 1;
  min-width: 30px;
  padding-vertical: 10px;
  border-radius: 8px;
  align-items: center;
  background-color: ${(p) => (p.$selected ? p.theme.buttonBackground : p.theme.formButtonBackground)};
`;

export const EscalaDayButtonText = styled.Text<{ $selected?: boolean }>`
  color: ${(p) => (p.$selected ? p.theme.buttonText : p.theme.textSecondary)};
  font-size: 12px;
  font-weight: ${(p) => (p.$selected ? '700' : '400')};
`;

export const EscalaActionsRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 8px;
`;

export const EscalaSaveButton = styled.Pressable<{ $flex?: boolean }>`
  ${(p) => (p.$flex ? 'flex: 1;' : '')}
  background-color: ${(p) => p.theme.buttonBackground};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

export const EscalaSaveButtonText = styled.Text`
  color: ${(p) => p.theme.buttonText};
  font-size: 15px;
  font-weight: 700;
`;

export const EscalaDeleteButton = styled.Pressable`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  background-color: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  align-items: center;
`;

export const EscalaDeleteButtonText = styled.Text`
  color: #EF4444;
  font-weight: 600;
  font-size: 15px;
`;
