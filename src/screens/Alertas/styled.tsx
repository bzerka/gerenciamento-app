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
  background-color: ${(p) => p.theme.buttonBackground};
  padding-vertical: 8px;
  padding-horizontal: 12px;
  border-radius: 8px;
`;

export const AddButtonText = styled.Text`
  color: ${(p) => p.theme.buttonText};
  font-weight: 600;
`;

