import React, { useState } from 'react';
import { Modal, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'styled-components/native';
import { ScreenContainer, EmptyCard } from '@/src/components/styled';
import { IconSymbol } from '@/components/ui/icon-symbol';
import NextServiceCard from '@/src/components/NextServiceCard';
import { useEventoStore } from '@/store/use-evento-store';
import { useAlertaStore } from '@/store/use-alerta-store';
import { parseISO, isAfter, isEqual } from 'date-fns';
import { scheduleAlertaForEvents, cancelAlertaNotifications } from '@/src/utils/notifications';
import {
  Container,
  HeaderRow,
  HeaderTitle,
  EmptyInner,
  EmptyText,
  EmptySubText,
  AlertsHeaderRow,
  AlertsTitle,
  AddButton,
  AddButtonText,
  AlertItem,
  AlertIconBox,
  AlertInfo,
  AlertTitle,
  AlertSub,
  DeleteButton,
  ModalOverlay,
  ModalSheet,
  ModalHandle,
  ModalTitle,
  FieldLabel,
  FieldInput,
  SegmentRow,
  SegmentButton,
  SegmentText,
  HorasInput,
  ActionsRow,
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
} from './styled';

export default function AlertasScreen() {
  const t = useTheme();
  const eventos = useEventoStore((s) => s.eventos);
  const { alertas, addAlerta, removeAlerta } = useAlertaStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [quando, setQuando] = useState<'antes' | 'durante'>('antes');
  const [horas, setHoras] = useState('2');
  const [tituloError, setTituloError] = useState('');

  function openModal() {
    setTitulo('');
    setQuando('antes');
    setHoras('2');
    setTituloError('');
    setModalVisible(true);
  }

  async function onConfirm() {
    if (!titulo.trim()) {
      setTituloError('Informe um nome para o alerta');
      return;
    }
    const novoAlerta = {
      titulo: titulo.trim(),
      quando,
      horasOffset: Number(horas) || 2,
    };
    const newId = addAlerta(novoAlerta);
    await scheduleAlertaForEvents({ ...novoAlerta, id: newId }, eventos);
    setModalVisible(false);
  }

  function subLabel(a: any) {
    const h = a.horasOffset ?? a.horasAntes ?? 2;
    if (a.quando === 'durante') return `${h} hora${h !== 1 ? 's' : ''} após início`;
    return `${h} hora${h !== 1 ? 's' : ''} antes`;
  }

  const hasUpcoming = (() => {
    const now = new Date();
    return eventos.some((ev) => {
      const start = ev.inicio ? new Date(`${ev.data}T${ev.inicio}`) : parseISO(ev.data);
      return isAfter(start, now) || isEqual(start, now);
    });
  })();

  return (
    <ScreenContainer>
      <Container>
        <HeaderRow>
          <HeaderTitle>Alertas</HeaderTitle>
        </HeaderRow>

        <ScrollView style={{ marginTop: 12 }}>
          <NextServiceCard />

          {!hasUpcoming && (
            <EmptyCard>
              <EmptyInner>
                <IconSymbol size={42} name="calendar" color={t.icon} />
                <EmptyText>Nenhum serviço agendado</EmptyText>
                <EmptySubText>Adicione serviços na aba Agenda</EmptySubText>
              </EmptyInner>
            </EmptyCard>
          )}

          <AlertsHeaderRow>
            <AlertsTitle>Meus Alertas</AlertsTitle>
            <AddButton onPress={openModal}>
              {/* <AddButtonText>Adicionar</AddButtonText> */}
              <IconSymbol name="plus" size={24} color={t.text} />
            </AddButton>
          </AlertsHeaderRow>

          {alertas.length === 0 ? (
            <EmptyCard>
              <EmptyInner>
                <IconSymbol size={36} name="bell" color={t.icon} />
                <EmptyText style={{ marginTop: 16, fontSize: 15 }}>Nenhum alerta criado</EmptyText>
                <EmptySubText>Crie alertas para ser avisado antes ou durante os serviços</EmptySubText>
              </EmptyInner>
            </EmptyCard>
          ) : (
            alertas.map((a) => (
              <AlertItem key={a.id}>
                <AlertIconBox>
                  <IconSymbol name="bell" size={20} color="#4DA6FF" />
                </AlertIconBox>
                <AlertInfo>
                  <AlertTitle>{a.titulo}</AlertTitle>
                  <AlertSub>{subLabel(a)}</AlertSub>
                </AlertInfo>
                <DeleteButton onPress={async () => {
                  await cancelAlertaNotifications(a.id, eventos);
                  removeAlerta(a.id);
                }}>
                  <IconSymbol name="trash" size={20} color={t.icon} />
                </DeleteButton>
              </AlertItem>
            ))
          )}
        </ScrollView>
      </Container>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'flex-end' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <ModalOverlay>
              <TouchableWithoutFeedback onPress={() => {}}>
              <ModalSheet>
              <ModalHandle />
              <ModalTitle>Novo Alerta</ModalTitle>

              <FieldLabel>Nome do Alerta</FieldLabel>
              <FieldInput
                value={titulo}
                onChangeText={(v) => { setTitulo(v); setTituloError(''); }}
                placeholder="Ex: Preparar equipamento, Tirar falta..."
                placeholderTextColor="#555"
                returnKeyType="done"
                style={tituloError ? { borderColor: '#F39C12' } : undefined}
              />

              <FieldLabel>Quando alertar?</FieldLabel>
              <SegmentRow>
                <SegmentButton $selected={quando === 'antes'} onPress={() => setQuando('antes')}>
                  <SegmentText $selected={quando === 'antes'}>Antes do{'\n'}serviço</SegmentText>
                </SegmentButton>
                <SegmentButton $selected={quando === 'durante'} onPress={() => setQuando('durante')}>
                  <SegmentText $selected={quando === 'durante'}>Durante o{'\n'}serviço</SegmentText>
                </SegmentButton>
              </SegmentRow>

              <FieldLabel>{quando === 'antes' ? 'Horas antes do início' : 'Horas após o início'}</FieldLabel>
              <HorasInput
                value={horas}
                onChangeText={setHoras}
                keyboardType="number-pad"
                returnKeyType="done"
                placeholderTextColor="#555"
              />

              <ActionsRow>
                <CancelButton onPress={() => setModalVisible(false)}>
                  <CancelButtonText>Cancelar</CancelButtonText>
                </CancelButton>
                <ConfirmButton onPress={onConfirm}>
                  <ConfirmButtonText>Adicionar</ConfirmButtonText>
                </ConfirmButton>
              </ActionsRow>
              </ModalSheet>
              </TouchableWithoutFeedback>
            </ModalOverlay>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenContainer>
  );
}
