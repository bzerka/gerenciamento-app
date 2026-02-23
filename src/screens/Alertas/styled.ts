import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${(p) => p.theme.background};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 24px;
  font-weight: 700;
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
  margin-top: 12px;
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
  gap: 4px;
`;

export const AddButtonText = styled.Text`
  color: ${(p) => p.theme.buttonText};
  font-weight: 600;
`;

/* ── Alerta item ─────────────────────────────────── */

export const AlertItem = styled.View`
  background-color: ${(p) => p.theme.cardBackground};
  border-radius: 12px;
  padding: 14px 16px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  gap: 14px;
`;

export const AlertIconBox = styled.View`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background-color: #1a2a4a;
  align-items: center;
  justify-content: center;
`;

export const AlertInfo = styled.View`
  flex: 1;
`;

export const AlertTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 15px;
  font-weight: 600;
`;

export const AlertSub = styled.Text`
  color: ${(p) => p.theme.icon};
  font-size: 12px;
  margin-top: 2px;
`;

export const DeleteButton = styled.Pressable`
  padding: 6px;
`;

/* ── Modal ───────────────────────────────────────── */

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
  color: ${(p) => p.theme.icon};
  font-size: 13px;
  margin-bottom: 8px;
`;

export const FieldInput = styled.TextInput`
  background-color: ${(p) => p.theme.cardBackground};
  border: 1px solid ${(p) => p.theme.border};
  padding: 13px 14px;
  border-radius: 10px;
  color: ${(p) => p.theme.text};
  font-size: 15px;
  margin-bottom: 18px;
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
  background-color: ${(p) => (p.$selected ? p.theme.formButtonBackground : p.theme.cardBackground)};
  border: 1px solid ${(p) => p.theme.border};
  align-items: center;
  justify-content: center;
`;

export const SegmentText = styled.Text<{ $selected?: boolean }>`
  color: ${(p) => p.theme.text};
  font-weight: ${(p) => (p.$selected ? '700' : '400')};
  font-size: 14px;
  text-align: center;
`;

export const HorasInput = styled.TextInput`
  background-color: ${(p) => p.theme.cardBackground};
  border: 1px solid ${(p) => p.theme.border};
  padding: 13px 14px;
  border-radius: 10px;
  color: ${(p) => p.theme.text};
  font-size: 15px;
  margin-bottom: 18px;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 4px;
`;

export const CancelButton = styled.Pressable`
  flex: 1;
  padding: 14px;
  border-radius: 10px;
  background-color: ${(p) => p.theme.cardBackground};
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
