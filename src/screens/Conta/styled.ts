import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${(p) => p.theme.background};
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(p) => p.theme.text};
  margin-bottom: 12px;
`;

export const HelpButton = styled.Pressable`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: ${(p) => p.theme.buttonBackground};
  align-items: center;
  justify-content: center;
`;

export const EmptyInner = styled.View`
  align-items: center;
`;

export const EmptyText = styled.Text`
  color: ${(p) => p.theme.text};
  margin-top: 12px;
  font-weight: 500;
  font-size: 16px;
  text-align: center;
`;

export const EmptySubText = styled.Text`
  color: ${(p) => p.theme.icon};
  margin-top: 8px;
  text-align: center;
`;

export const AlertsHeaderRow = styled.View`
  margin-bottom: 18px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const AlertsTitle = styled.Text`
  font-size: 20px;
  color: ${(p) => p.theme.text};
  font-weight: 600;
`;

export const AddButton = styled.Pressable`
  background-color: ${(p) => p.theme.cardBackground};
  border: 0.5px solid ${(p) => p.theme.icon};
  border-radius: 50px;
  padding: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const AlertsList = styled.View`
  gap: 8px;
`;

export const AlertCard = styled.Pressable`
  background-color: ${(p) => p.theme.cardBackground};
  border-radius: 12px;
  padding: 12px 14px;
  border-left-width: 3px;
  border-left-color: #4DA6FF;
  shadow-color: #000;
  shadow-offset: 0 1px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 1;
`;

export const AlertCardTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const AlertTimeBadge = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => p.theme.textSecondary};
`;

export const AlertCardTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 15px;
  font-weight: 700;
  flex: 1;
  margin-bottom: 2px;
`;

export const AlertCardSub = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 12px;
  opacity: 0.9;
  flex-shrink: 1;
`;

export const ToggleTrack = styled.Pressable<{ $on: boolean }>`
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background-color: ${(p) => (p.$on ? p.theme.buttonBackground : p.theme.icon)};
  flex-direction: row;
  align-items: center;
  padding-horizontal: 2px;
  justify-content: ${(p) => (p.$on ? 'flex-end' : 'flex-start')};
`;

export const ToggleThumb = styled.View`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: #FFF;
`;

export const SwipeDeleteAction = styled.Pressable`
  background-color: #EF4444;
  justify-content: center;
  align-items: center;
  width: 72px;
  border-radius: 14px;
  align-self: stretch;
`;

export const InfoBox = styled.View`
  background-color: ${(p) => p.theme.tintMuted};
  border-radius: 12px;
  padding: 12px;
  margin-top: 16px;
  margin-bottom: 24px;
`;

export const InfoBoxText = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 13px;
  line-height: 20px;
  text-align: justify;
`;

/* ── Modal (from Alertas) ─────────────────────────── */

export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.55);
`;

export const ModalSheet = styled.View`
  background-color: ${(p) => p.theme.cardBackground};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 24px 20px 36px;
  max-height: 90%;
`;

export const ModalHandle = styled.View`
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background-color: ${(p) => p.theme.icon};
  align-self: center;
  margin-bottom: 20px;
`;

export const ModalTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
`;

export const FieldLabel = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 13px;
  margin-top: 16px;
  margin-bottom: 6px;
`;

export const FieldInput = styled.TextInput`
  background-color: ${(p) => p.theme.formButtonBackground};
  padding: 13px 14px;
  border-radius: 10px;
  border-width: 1px;
  border-color: transparent;
  color: ${(p) => p.theme.text};
  font-size: 15px;
  margin-bottom: 18px;
`;

export const PasswordInputRow = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(p) => p.theme.formButtonBackground};
  border-radius: 10px;
  border-width: 1px;
  border-color: transparent;
  margin-bottom: 18px;
  padding-right: 8px;
`;

export const PasswordFieldInput = styled.TextInput`
  flex: 1;
  padding: 13px 14px;
  color: ${(p) => p.theme.text};
  font-size: 15px;
`;

export const PasswordToggle = styled.Pressable`
  padding: 8px;
  align-items: center;
  justify-content: center;
`;

export const SegmentRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 18px;
`;

export const SegmentButton = styled.Pressable<{ $selected?: boolean }>`
  flex: 1;
  padding: 14px 8px;
  border-radius: 10px;
  background-color: ${(p) => (p.$selected ? p.theme.formButtonBackgroundHover : p.theme.formButtonBackground)};
  align-items: center;
  justify-content: center;
`;

export const SegmentText = styled.Text<{ $selected?: boolean }>`
  color: ${(p) => p.theme.text};
  font-size: 14px;
  text-align: center;
`;

export const HorasInput = styled.TextInput`
  background-color: ${(p) => p.theme.formButtonBackground};
  padding: 13px 14px;
  border-radius: 10px;
  color: ${(p) => p.theme.text};
  font-size: 15px;
  margin-bottom: 18px;
`;

export const ServicoChipsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
  width: 100%;
`;

export const ServicoChip = styled.Pressable<{ $selected?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  max-height: 42px;
  border-radius: 10px;
  min-width: 30%;
  flex: 1 1 30%;
  max-width: 100%;
  background-color: ${(p) => (p.$selected ? p.theme.formButtonBackgroundHover : p.theme.formButtonBackground)};
`;

export const ServicoChipText = styled.Text<{ $selected?: boolean }>`
  color: ${(p) => p.theme.text};
  font-size: 14px;
  font-weight: ${(p) => (p.$selected ? '600' : '400')};
  flex-shrink: 1;
  max-width: 100%;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 4px;
`;

export const DeleteButton = styled.Pressable`
  padding: 14px 20px;
  border-radius: 12px;
  background-color: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  align-items: center;
  justify-content: center;
`;

export const DeleteButtonText = styled.Text`
  color: #EF4444;
  font-weight: 600;
  font-size: 15px;
`;

export const CancelButton = styled.Pressable`
  flex: 1;
  padding: 13px;
  border-radius: 10px;
  background-color: ${(p) => p.theme.formButtonBackground};
  border: 1px solid ${(p) => p.theme.border};
  align-items: center;
`;

export const CancelButtonText = styled.Text`
  color: ${(p) => p.theme.text};
  font-weight: 600;
`;

export const ConfirmButton = styled.Pressable`
  flex: 1;
  padding: 14px;
  border-radius: 10px;
  background-color: ${(p) => p.theme.buttonBackground};
  align-items: center;
`;

export const ConfirmButtonText = styled.Text`
  color: ${(p) => p.theme.buttonText};
  font-weight: 700;
`;

/* ── Conta options ────────────────────────────────── */

export const ContaOptionCard = styled.Pressable`
  flex-direction: row;
  align-items: center;
  background-color: ${(p) => p.theme.cardBackground};
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 12px;
  gap: 14px;
`;

export const ContaOptionContent = styled.View`
  flex: 1;
`;

export const ContaOptionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(p) => p.theme.text};
`;

export const ContaOptionSub = styled.Text`
  font-size: 13px;
  color: ${(p) => p.theme.textSecondary};
  margin-top: 2px;
`;

export const ContaOptionArrow = styled.View``;

export const LogoutCard = styled.Pressable`
  flex-direction: row;
  align-items: center;
  background-color: ${(p) => p.theme.cardBackground};
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 24px;
  gap: 14px;
`;

export const LogoutContent = styled.View`
  flex: 1;
`;

export const LogoutTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(p) => p.theme.text};
`;

export const LogoutSub = styled.Text`
  font-size: 13px;
  color: ${(p) => p.theme.text};
  margin-top: 2px;
  opacity: 0.9;
`;
