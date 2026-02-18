import React, { useState } from 'react';
import { Modal } from 'react-native';
import { useTheme } from 'styled-components/native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useServicoStore } from '@/store/use-servico-store';
import {
  Container,
  HeaderRow,
  HeaderTitle,
  AddButton,
  AddButtonText,
  List,
  ServiceCard,
  ServiceMain,
  ColorSwatch,
  ServiceName,
  IconButton,
  SheetOverlay,
  Sheet,
  ModalTitle,
  Label,
  Input,
  ColorGrid,
  ColorButton,
  ErrorText,
  ActionsRow,
  CancelButton,
  PrimaryButton,
  PrimaryButtonText,
} from './styled';
import { ScreenContainer } from '@/src/components/styled/Screen';

const COLORS = ['#4DA6FF', '#7ED957', '#F39C12', '#FF6BBD', '#9B59FF', '#00C2A8', '#FF8A00', '#23A6D5'];

export default function ServicosScreen() {
  const { servicos, addServico, removeServico } = useServicoStore();
  const t = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState(COLORS[0]);
  const [error, setError] = useState('');

  function onAdd() {
    if (!nome.trim()) return;
    const exists = servicos.some((s) => s.cor.toLowerCase() === cor.toLowerCase());
    if (exists) {
      setError('Já existe um serviço com essa cor. Escolha outra cor.');
      return;
    }
    addServico({ nome: nome.trim(), cor });
    setNome('');
    setCor(COLORS[0]);
    setError('');
    setModalVisible(false);
  }

  return (
    <ScreenContainer> 
      <Container>
        <HeaderRow>
          <HeaderTitle>Serviços</HeaderTitle>
          <AddButton onPress={() => setModalVisible(true)}>
            <AddButtonText>+ Adicionar</AddButtonText>
          </AddButton>
        </HeaderRow>

        <ColorGrid style={{ marginBottom: 12 }} /> {/* spacer */}
        <List>
          {servicos.map((s) => (
            <ServiceCard key={s.id}>
              <ServiceMain>
                <ColorSwatch $bg={s.cor} />
                <ServiceName>{s.nome}</ServiceName>
              </ServiceMain>
              <IconButton onPress={() => removeServico(s.id)}>
                <IconSymbol name="trash" size={20} color={t.icon} />
              </IconButton>
            </ServiceCard>
          ))}
        </List>

        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <SheetOverlay>
            <Sheet>
              <ModalTitle>Novo Serviço</ModalTitle>
              <Label>Nome do Serviço</Label>
              <Input value={nome} onChangeText={setNome} placeholder="Ex: Plantão, Extra..." placeholderTextColor="#666" />

              <Label>Cor</Label>
              <ColorGrid>
                {COLORS.map((c) => {
                  const used = servicos.some((s) => s.cor.toLowerCase() === c.toLowerCase());
                  return (
                    <ColorButton
                      key={c}
                      onPress={() => {
                        if (used) return;
                        setCor(c);
                        setError('');
                      }}
                      $bg={c}
                      $selected={cor === c}
                      $disabled={used}
                    />
                  );
                })}
              </ColorGrid>
              {error ? <ErrorText>{error}</ErrorText> : null}

              <ActionsRow>
                <CancelButton onPress={() => setModalVisible(false)}>
                  <PrimaryButtonText style={{ color: '#FFF' }}>Cancelar</PrimaryButtonText>
                </CancelButton>
                <PrimaryButton onPress={onAdd}>
                  <PrimaryButtonText>Adicionar</PrimaryButtonText>
                </PrimaryButton>
              </ActionsRow>
            </Sheet>
          </SheetOverlay>
        </Modal>
      </Container>
    </ScreenContainer>
  );
}

