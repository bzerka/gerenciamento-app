import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${(p) => p.theme.background};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const HeaderTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 22px;
  font-weight: 700;
`;

export const AddButton = styled.Pressable`
  background-color: #0B5FFF;
  padding-vertical: 8px;
  padding-horizontal: 12px;
  border-radius: 8px;
`;

export const AddButtonText = styled.Text`
  color: #fff;
  font-weight: 600;
`;

export const List = styled.View``;

export const ServiceCard = styled.View`
  background-color: #0b0b0b;
  border-radius: 12px;
  margin-bottom: 12px;
  padding: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ServiceMain = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const ColorSwatch = styled.View<{ $bg?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: ${(p) => p.$bg ?? '#444'};
`;

export const ServiceName = styled.Text`
  color: #fff;
  font-weight: 600;
`;

export const IconButton = styled.Pressable`
  padding: 8px;
`;

/* Modal sheet */
export const SheetOverlay = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0,0,0,0.4);
`;

export const Sheet = styled.View`
  background-color: #111;
  padding: 16px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

export const ModalTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  margin-bottom: 8px;
`;

export const Label = styled.Text`
  color: #ddd;
  margin-bottom: 6px;
`;

export const Input = styled.TextInput`
  background-color: #222;
  padding: 10px;
  border-radius: 8px;
  color: #fff;
  margin-bottom: 12px;
`;

export const ColorGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

export const ColorButton = styled.Pressable<{ $bg?: string; $selected?: boolean; $disabled?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: ${(p) => p.$bg ?? '#444'};
  margin-right: 8px;
  border-width: ${(p) => (p.$selected ? '2px' : '0px')};
  border-color: #fff;
  opacity: ${(p) => (p.$disabled ? 0.35 : 1)};
`;

export const ErrorText = styled.Text`
  color: #f39c12;
  margin-bottom: 8px;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const CancelButton = styled.Pressable`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background-color: #333;
  align-items: center;
`;

export const PrimaryButton = styled.Pressable`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background-color: #0B5FFF;
  align-items: center;
  justify-content: center;
`;

export const PrimaryButtonText = styled.Text`
  color: #fff;
`;

