import React, { useState, useEffect } from 'react';
import { Modal, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components/native';
import { ScreenContainer, EmptyCard } from '@/src/components/styled';
import { IconSymbol } from '@/components/ui/icon-symbol';
import NextServiceCard from '@/src/components/NextServiceCard';
import { useEventoStore } from '@/store/use-evento-store';
import { useAlertaStore } from '@/store/use-alerta-store';
import { useServicoStore } from '@/store/use-servico-store';
import { parseISO, isAfter, isEqual } from 'date-fns';
import { scheduleAlertaForEvents, cancelAlertaNotifications, rescheduleAllAlertas } from '@/src/utils/notifications';
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
  AlertsList,
  AlertCard,
  AlertCardTopRow,
  AlertTimeBadge,
  AlertCardTitle,
  AlertCardSub,
  SwipeDeleteAction,
  InfoBox,
  InfoBoxText,
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
  ServicoChipsRow,
  ServicoChip,
  ServicoChipText,
  ToggleTrack,
  ToggleThumb,
  ActionsRow,
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
  DeleteButton,
  DeleteButtonText
} from './styled';

export default function AlertasScreen() {
  const t = useTheme();
  const eventos = useEventoStore((s) => s.eventos);
  const servicos = useServicoStore((s) => s.servicos);
  const { alertas, addAlerta, updateAlerta, removeAlerta } = useAlertaStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [quando, setQuando] = useState<'antes' | 'durante'>('antes');
  const [horas, setHoras] = useState('2');
  const [servicoIds, setServicoIds] = useState<string[]>([]);
  const [tituloError, setTituloError] = useState('');


  function openNew() {
    setEditingId(null);
    setTitulo('');
    setQuando('antes');
    setHoras('2');
    setServicoIds([]);
    setTituloError('');
    setModalVisible(true);
  }

  function openEdit(a: { id: string; titulo: string; quando: 'antes' | 'durante'; horasOffset?: number; servicoIds?: string[] }) {
    setEditingId(a.id);
    setTitulo(a.titulo);
    setQuando(a.quando);
    setHoras(String(a.horasOffset ?? 2));
    setServicoIds(a.servicoIds ?? []);
    setTituloError('');
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setEditingId(null);
  }

  async function onConfirm() {
    if (!titulo.trim()) {
      setTituloError('Informe um nome para o lembrete');
      return;
    }
    const data = {
      titulo: titulo.trim(),
      quando,
      horasOffset: Number(horas) || 2,
      servicoIds: servicoIds.length > 0 ? servicoIds : undefined,
    };
    Keyboard.dismiss();
    setModalVisible(false);

    if (editingId) {
      updateAlerta(editingId, data);
      const updated = useAlertaStore.getState().alertas.find((a) => a.id === editingId);
      if (updated) await scheduleAlertaForEvents({ ...updated, ...data }, eventos);
    } else {
      const newId = addAlerta({ ...data, ativo: true });
      await scheduleAlertaForEvents({ ...data, id: newId, ativo: true }, eventos);
    }
  }

  async function onDelete() {
    if (!editingId) return;
    await cancelAlertaNotifications(editingId, eventos);
    removeAlerta(editingId);
    closeModal();
  }

  async function onToggleAtivo(a: { id: string; titulo: string; quando: 'antes' | 'durante'; horasOffset?: number; ativo?: boolean; servicoIds?: string[] }, newValue: boolean) {
    updateAlerta(a.id, { ativo: newValue });
    if (newValue) {
      await scheduleAlertaForEvents({ ...a, ativo: true }, eventos);
    } else {
      await cancelAlertaNotifications(a.id, eventos);
    }
  }

  function timeLabel(a: any) {
    const h = a.horasOffset ?? a.horasAntes ?? 2;
    if (a.quando === 'durante') return `${h}h após`;
    return `${h}h antes`;
  }

  function servicosLabel(a: { servicoIds?: string[] }) {
    if (!a.servicoIds || a.servicoIds.length === 0) return 'Todos os serviços';
    const names = a.servicoIds
      .map((id) => servicos.find((s) => s.id === id)?.nome)
      .filter(Boolean);
    return names.join(', ') || 'Todos os serviços';
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
          <HeaderTitle>Lembretes</HeaderTitle>
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
            <AlertsTitle>Meus Lembretes</AlertsTitle>
            <AddButton onPress={openNew}>
              <IconSymbol name="plus" size={24} color={t.text} />
            </AddButton>
          </AlertsHeaderRow>

          {alertas.length === 0 ? (
            <EmptyCard>
              <EmptyInner>
                <IconSymbol size={36} name="bell" color={t.icon} />
                <EmptyText style={{ marginTop: 16, fontSize: 15 }}>Nenhum lembrete criado</EmptyText>
                <EmptySubText>Crie lembretes para ser avisado antes ou durante os serviços</EmptySubText>
              </EmptyInner>
            </EmptyCard>
          ) : (
            <AlertsList>
              {alertas.map((a) => (
                <Swipeable
                  key={a.id}
                  renderRightActions={() => (
                    <SwipeDeleteAction
                      onPress={async () => {
                        await cancelAlertaNotifications(a.id, eventos);
                        removeAlerta(a.id);
                      }}>
                      <IconSymbol name="trash" size={24} color="#FFF" />
                    </SwipeDeleteAction>
                  )}
                  overshootRight={false}>
                  <AlertCard onPress={() => openEdit(a)}>
                    <AlertCardTopRow>
                      <AlertTimeBadge>{timeLabel(a)}</AlertTimeBadge>
                      <View onStartShouldSetResponder={() => true}>
                        <ToggleTrack
                          $on={a.ativo !== false}
                          onPress={() => onToggleAtivo(a, a.ativo === false)}
                        >
                          <ToggleThumb />
                        </ToggleTrack>
                      </View>
                    </AlertCardTopRow>
                    <AlertCardTitle>{a.titulo}</AlertCardTitle>
                    <AlertCardSub>{servicosLabel(a)}</AlertCardSub>
                  </AlertCard>
                </Swipeable>
              ))}
            </AlertsList>
          )}

          <InfoBox>
            <InfoBoxText>
              Cada notificação é disparada em relação ao início ou ao fim do plantão. Você pode limitar um lembrete a serviços específicos (ex: tirar falta só para RAS).
            </InfoBoxText>
          </InfoBox>
        </ScrollView>
      </Container>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'flex-end' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <ModalOverlay>
              <TouchableWithoutFeedback onPress={() => {}}>
              <ModalSheet>
              <ModalHandle />
              <ModalTitle>{editingId ? 'Editar Lembrete' : 'Novo Lembrete'}</ModalTitle>

              <FieldLabel>Nome do Lembrete</FieldLabel>
              <FieldInput
                value={titulo}
                onChangeText={(v) => { setTitulo(v); setTituloError(''); }}
                placeholder="Ex: Preparar equipamento, Tirar falta..."
                placeholderTextColor={t.textSecondary}
                returnKeyType="done"
                style={tituloError ? { borderColor: '#F39C12' } : undefined}
              />

              <FieldLabel>Quando lembrar?</FieldLabel>
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
                placeholderTextColor={t.textSecondary}
              />

              <FieldLabel>Para quais serviços?</FieldLabel>
              <ServicoChipsRow>
                <ServicoChip
                  $selected={servicoIds.length === 0}
                  onPress={() => setServicoIds([])}
                >
                  <ServicoChipText $selected={servicoIds.length === 0}>Todos</ServicoChipText>
                </ServicoChip>
                {servicos.map((s) => {
                  const sel = servicoIds.includes(s.id);
                  return (
                    <ServicoChip
                      key={s.id}
                      $selected={sel}
                      onPress={() => {
                        setServicoIds((prev) =>
                          prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                        );
                      }}
                    >
                      <ServicoChipText $selected={sel}>{s.nome}</ServicoChipText>
                    </ServicoChip>
                  );
                })}
              </ServicoChipsRow>

              <ActionsRow>
                {editingId ? (
                  <DeleteButton onPress={onDelete}>
                    <DeleteButtonText>Excluir</DeleteButtonText>
                  </DeleteButton>
                ) : null}
                <CancelButton onPress={closeModal}>
                  <CancelButtonText>Cancelar</CancelButtonText>
                </CancelButton>
                <ConfirmButton onPress={onConfirm}>
                  <ConfirmButtonText>{editingId ? 'Salvar' : 'Adicionar'}</ConfirmButtonText>
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
