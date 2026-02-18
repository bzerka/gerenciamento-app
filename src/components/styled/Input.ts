import styled from 'styled-components/native';

export const Label = styled.Text`
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: bold;
  color: ${(p) => p.theme.text};
`;

export const TextInputStyled = styled.TextInput`
  border-width: 1px;
  border-radius: 10px;
  padding: 14px;
  font-size: 16px;
  margin-bottom: 20px;
  color: ${(p) => p.theme.text};
  border-color: ${(p) => p.theme.border};
  background-color: ${(p) => p.theme.background};
`;

export const TurnoRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-bottom: 24px;
`;
