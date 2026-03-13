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

export const EmptyWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

export const EmptyIconCircle = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${(p) => p.theme.tintMuted};
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const EmptyTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
`;

export const EmptySub = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 15px;
  text-align: center;
  line-height: 22px;
`;

export const NotesList = styled.View`
  gap: 14px;
  padding-bottom: 100px;
`;

export const NotaCard = styled.Pressable`
  background-color: ${(p) => p.theme.cardBackground};
  border-radius: 14px;
  padding: 18px 20px;
  border-left-width: 4px;
  border-left-color: #F59E0B;
  min-height: 80px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.06;
  shadow-radius: 6px;
  elevation: 2;
`;

export const NotaCardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const NotaTitulo = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 16px;
  font-weight: 700;
  flex: 1;
`;

export const NotaDate = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 12px;
  margin-left: 8px;
`;

export const NotaPreview = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 14px;
  line-height: 20px;
  opacity: 0.9;
`;

export const SwipeDeleteAction = styled.Pressable`
  background-color: #EF4444;
  justify-content: center;
  align-items: center;
  width: 72px;
  border-radius: 14px;
  align-self: stretch;
`;

/* Modal */
export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalSheet = styled.View`
  background-color: ${(p) => p.theme.cardBackground};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px 20px 4px;
  max-height: 90%;
`;

export const ModalHandle = styled.View`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background-color: ${(p) => p.theme.iconMuted};
  align-self: center;
  margin-bottom: 24px;
`;

export const ModalTitle = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
`;

export const ModalHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const ModalTitleInHeader = styled(ModalTitle)`
  margin-bottom: 0;
  flex: 1;
`;

export const ModalCloseButton = styled.Pressable`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

export const FieldLabel = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
`;

export const TituloInput = styled.TextInput`
  background-color: ${(p) => p.theme.formButtonBackground};
  padding: 13px 14px;
  border-radius: 10px;
  color: ${(p) => p.theme.text};
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
`;

export const ConteudoInput = styled.TextInput`
  background-color: ${(p) => p.theme.formButtonBackground};
  padding: 13px 14px;
  border-radius: 10px;
  color: ${(p) => p.theme.text};
  font-size: 15px;
  min-height: 120px;
  text-align-vertical: top;
  margin-bottom: 24px;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 4px;
`;

export const DeleteButton = styled.Pressable`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  background-color: #EF4444;
  align-items: center;
  justify-content: center;
`;

export const DeleteButtonText = styled.Text`
  color: #FFFFFF;
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

export const SaveButton = styled.Pressable`
  flex: 2;
  flex-direction: row;
  padding: 14px;
  border-radius: 12px;
  background-color: ${(p) => p.theme.buttonBackground};
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const SaveButtonText = styled.Text`
  color: ${(p) => p.theme.buttonText};
  font-weight: 700;
  font-size: 15px;
`;
