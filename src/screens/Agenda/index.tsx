import { IconSymbol } from '@/components/ui/icon-symbol';
import { Card, CardText, ScreenContainer } from '@/src/components/styled';
import { formatBRL } from '@/src/utils/currency';
import { cancelEventNotifications, scheduleAlertaForEvents } from '@/src/utils/notifications';
import { useAlertaStore } from '@/store/use-alerta-store';
import { useEventoStore } from '@/store/use-evento-store';
import { useServicoStore } from '@/store/use-servico-store';
import Entypo from '@expo/vector-icons/Entypo';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
  addDays,
  addHours,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, Text } from 'react-native';
import { useTheme } from 'styled-components/native';
import {
  CalendarRow,
  CloseButton,
  Container,
  DangerButton,
  DangerButtonText,
  DayBox,
  DayCell,
  DayNumberWrapper,
  DayText,
  DetailBadge,
  DetailBadgeRow,
  DetailBadgeText,
  DetailDivider,
  DetailInfo,
  DetailLabel,
  DetailRow,
  DetailSection,
  DetailSubValue,
  DetailValue,
  AddServiceIconButton,
  ErrorText,
  EventChip,
  EventChipsRow,
  EventChipText,
  FlexOptionsRow,
  FormInput,
  FormLabel,
  FullButton,
  FullButtonText,
  AddAnotherServiceButton,
  AddAnotherServiceButtonText,
  AddOccurrenceButton,
  AddOccurrenceButtonText,
  FormActionsRow,
  FormDeleteButton,
  FormDeleteButtonText,
  FormSaveButton,
  FormSaveButtonText,
  HeaderRow,
  LegendColor,
  LegendItem,
  LegendRow,
  MonthTitle,
  MultilineInput,
  NavButton,
  ObsBox,
  ObsText,
  OptionButton,
  OptionsRow,
  OptionText,
  PriceTipBox,
  PriceTipLink,
  PriceTipRow,
  PriceTipText,
  ServiceLabel,
  ServiceLabelText,
  ServiceLabelsColumn,
  Sheet,
  SheetSurface,
  SheetContent,
  SheetHeader,
  SheetTitle,
  TimePressable,
  TimeText,
  WeekDayText,
  WeekRow
} from './styled';

function buildMonthMatrix(date: Date) {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
  const matrix: Date[] = [];
  let cur = start;
  while (matrix.length < 35) {
    matrix.push(cur);
    cur = addDays(cur, 1);
  }
  return matrix;
}

function servicoSigla(nome: string, length: number = 3): string {
  if (nome.length <= length+1) return nome.toUpperCase();
  return nome.slice(0, length).toUpperCase();
}

export default function AgendaScreen() {
  const [month, setMonth] = useState(new Date());
  const matrix = useMemo(() => buildMonthMatrix(month), [month]);
  const eventos = useEventoStore((s) => s.eventos);
  const servicos = useServicoStore((s) => s.servicos);
  
  const servicosNormalPrimeiro = useMemo(() => {
    const normal = servicos.find((s) => s.nome.toLowerCase() === 'normal');
    const rest = servicos.filter((s) => s.nome.toLowerCase() !== 'normal');
    return normal ? [normal, ...rest] : servicos;
  }, [servicos]);
  const normalServicoId = useMemo(
    () => servicos.find((s) => s.nome.toLowerCase() === 'normal')?.id,
    [servicos]
  );

  const alertas = useAlertaStore((s) => s.alertas);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [existingEvent, setExistingEvent] = useState<any | null>(null);

  // form fields
  const [servicoId, setServicoId] = useState<string | null>(null);
  const [inicio, setInicio] = useState('07:00');
  const [duracao, setDuracao] = useState(6);
  const [local, setLocal] = useState('');
  const [valorInput, setValorInput] = useState('');
  const [notas, setNotas] = useState('');
  const [localError, setLocalError] = useState('');
  const [valorError, setValorError] = useState('');
  const [showIOSTimePicker, setShowIOSTimePicker] = useState(false);

  function inicioToDate(s: string): Date {
    const [hh, mm] = s.split(':').map(Number);
    const d = new Date();
    d.setHours(isNaN(hh) ? 7 : hh, isNaN(mm) ? 0 : mm, 0, 0);
    return d;
  }

  function openTimePicker() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: inicioToDate(inicio),
        onChange: (_event, date) => {
          if (date) {
            const hh = String(date.getHours()).padStart(2, '0');
            const mm = String(date.getMinutes()).padStart(2, '0');
            setInicio(`${hh}:${mm}`);
          }
        },
        mode: 'time',
        is24Hour: true,
      });
    } else {
      setShowIOSTimePicker((v) => !v);
    }
  }

  function computeEndTime(inicioStr: string, horas: number) {
    const [hh, mm] = inicioStr.split(':').map(Number);
    if (isNaN(hh)) return '--:--';
    const endHour = (hh + horas) % 24;
    return `${String(endHour).padStart(2, '0')}:${String(mm || 0).padStart(2, '0')}`;
  }

  function selectEventToView(ev: any) {
    setExistingEvent(ev);
    setServicoId(ev.servicoId ?? servicos[0]?.id ?? null);
    setInicio(ev.inicio ?? '07:00');
    setDuracao(ev.duracaoHoras ?? 6);
    setLocal(ev.local ?? '');
    setValorInput(ev.valor != null ? String(ev.valor).replace('.', ',') : '');
    setNotas(ev.notas ?? '');
  }

  function openFor(date: Date) {
    setSelectedDate(date);
    const data = date.toISOString().slice(0, 10);
    const dayEvents = useEventoStore.getState().eventos.filter((e) => e.data === data);
    const found = dayEvents[0] ?? null;
    setExistingEvent(found);
    setLocalError('');
    setValorError('');

    if (found) {
      selectEventToView(found);
      setViewMode(true);
    } else {
      setServicoId(servicos[0]?.id ?? null);
      setInicio('07:00');
      setDuracao(6);
      setLocal('');
      setValorInput('');
      setNotas('');
      setViewMode(false);
    }
    setModalVisible(true);
  }

  function closeModal() {
    Keyboard.dismiss();
    setModalVisible(false);
    setExistingEvent(null);
    setViewMode(false);
    setLocalError('');
    setValorError('');
    setShowIOSTimePicker(false);
  }

  /** Fecha o sheet da Agenda.
   * - Se estiver editando um serviço existente (form view com existingEvent), volta para o detalhe do dia.
   * - Caso contrário, fecha o modal normalmente.
   */
  function handleCloseSheet() {
    if (existingEvent && !viewMode) {
      selectEventToView(existingEvent);
      setViewMode(true);
      return;
    }
    closeModal();
  }

  const LIMITE_HORAS_MENSAIS = 120;

  function totalHorasMesAposAlteracao(
    dataStr: string,
    duracaoNovo: number,
    servicoIdNovo: string | null,
    existingEv: typeof existingEvent
  ): number {
    const month = dataStr.slice(0, 7);
    const eventosAtual = useEventoStore.getState().eventos;
    const monthEvents = eventosAtual.filter((e) => e.data.startsWith(month));
    const billedEvents = monthEvents.filter((e) => !isNormal(e.servicoId));
    let total = billedEvents.reduce((acc, e) => acc + (e.duracaoHoras ?? 0), 0);
    if (existingEv && !isNormal(existingEv.servicoId)) {
      total -= existingEv.duracaoHoras ?? 0;
    }
    if (!isNormal(servicoIdNovo)) {
      total += duracaoNovo;
    }
    return total;
  }

  async function doSaveEvento(payload: {
    data: string;
    servicoId: string;
    inicio: string;
    duracaoHoras: number;
    local: string;
    valor: number;
    notas: string;
  }) {
    if (existingEvent) {
      useEventoStore.getState().updateEvento(existingEvent.id, payload);
      const updatedEvento = { ...existingEvent, ...payload };
      for (const alerta of alertas) {
        await scheduleAlertaForEvents(alerta, [updatedEvento]);
      }
    } else {
      const newId = useEventoStore.getState().addEvento(payload);
      const novo = useEventoStore.getState().eventos.find((e) => e.id === newId);
      if (novo) {
        for (const alerta of alertas) {
          await scheduleAlertaForEvents(alerta, [novo]);
        }
      }
    }
    closeModal();
  }

  async function onSubmit() {
    setLocalError('');
    setValorError('');
    const data = selectedDate
      ? selectedDate.toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);
    const dayEvs = useEventoStore.getState().eventos.filter((e) => e.data === data);
    if (!existingEvent && dayEvs.length >= 2) {
      setLocalError('Limite de 2 serviços por dia atingido');
      return;
    }
    const isNormalEvento = isNormal(servicoId);
    const normalized = valorInput.includes(',')
      ? valorInput.replace(/\./g, '').replace(',', '.').trim()
      : valorInput.trim();
    const valorNum = isNormalEvento ? 0 : (normalized ? Number(normalized) : 0);
    if (!isNormalEvento && isNaN(valorNum)) {
      setValorError('Valor inválido');
      return;
    }
    const payload = {
      data,
      servicoId: servicoId ?? servicos[0]?.id ?? '',
      inicio,
      duracaoHoras: duracao,
      local,
      valor: valorNum,
      notas,
    };

    const totalApos = totalHorasMesAposAlteracao(data, duracao, servicoId, existingEvent);
    if (totalApos > LIMITE_HORAS_MENSAIS) {
      Alert.alert(
        'Limite de horas atingido',
        `Este serviço fará o total mensal ultrapassar 120h.\n\nTotal previsto: ${totalApos.toFixed(1)}h.`,
        [
          { text: 'Alterar', style: 'cancel' },
          { text: 'Adicionar', onPress: () => doSaveEvento(payload) },
        ]
      );
      return;
    }

    await doSaveEvento(payload);
  }

  async function removeEvento() {
    if (!existingEvent) return;
    await cancelEventNotifications(existingEvent.id, alertas);
    useEventoStore.getState().removeEvento(existingEvent.id);
    closeModal();
  }

  const currentServico = servicos.find(
    (s) => s.id === (viewMode ? existingEvent?.servicoId : servicoId)
  );
  const isNormal = (id?: string | null) =>
    servicos.find((s) => s.id === id)?.nome.toLowerCase() === 'normal';

  // Auto-fill / clear valor quando serviço/turno mudam (somente ao criar)
  useEffect(() => {
    // don't override when viewing/editing an existing event
    if (viewMode || existingEvent) return;

    // if service is "normal" clear value
    if (isNormal(servicoId)) {
      setValorInput('');
      return;
    }

    const servico = servicos.find((s) => s.id === servicoId);
    const cfg = servico?.turnos?.[duracao];
    const preco = cfg?.valor;
    if (preco != null) {
      setValorInput(String(preco).replace('.', ','));
    } else {
      setValorInput('');
    }
  }, [servicoId, duracao, viewMode, existingEvent, servicos]);

  const t = useTheme();

  return (
    <ScreenContainer>
      <Container>
        <HeaderRow>
          <NavButton onPress={() => setMonth(subMonths(month, 1))}>
            <IconSymbol name="chevron.left" size={24} color={t.icon} />
          </NavButton>
          <MonthTitle>{format(month, 'MMMM yyyy', { locale: ptBR })}</MonthTitle>
          <NavButton onPress={() => setMonth(addMonths(month, 1))}>
            <IconSymbol name="chevron.right" size={24} color={t.icon} />
          </NavButton>
        </HeaderRow>

        <WeekRow>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
            <WeekDayText key={d}>{d}</WeekDayText>
          ))}
        </WeekRow>

        {(() => {
          const rows: Date[][] = [];
          for (let r = 0; r < 5; r++) rows.push(matrix.slice(r * 7, r * 7 + 7));
          return rows.map((row, ri) => (
            <CalendarRow key={ri}>
              {row.map((d, i) => {
                const dayEvents = eventos.filter(
                  (ev) => ev.data === d.toISOString().slice(0, 10)
                );
                const dayEventsNormalPrimeiro = [...dayEvents].sort((a, b) => {
                  if (normalServicoId && a.servicoId === normalServicoId) return -1;
                  if (normalServicoId && b.servicoId === normalServicoId) return 1;
                  return 0;
                });
                const isCurrentMonth = isSameMonth(d, month);
                const isToday = isSameDay(d, new Date());
                const eventsToShow = dayEventsNormalPrimeiro.slice(0, 2);
                return (
                  <DayCell key={i} onPress={() => openFor(d)} $opacity={isCurrentMonth ? 1 : 0.4}>
                    <DayBox $isToday={isToday}>
                      <DayNumberWrapper $isToday={isToday}>
                        <DayText $isToday={isToday}>{format(d, 'd')}</DayText>
                      </DayNumberWrapper>
                      <ServiceLabelsColumn>
                        {eventsToShow.map((ev) => {
                          const servico = servicos.find((s) => s.id === ev.servicoId);
                          const cor = servico?.cor ?? '#666';
                          const sigla = servico ? servicoSigla(servico.nome) : '—';
                          return (
                            <ServiceLabel key={ev.id} $color={cor}>
                              <ServiceLabelText>{sigla}</ServiceLabelText>
                            </ServiceLabel>
                          );
                        })}
                      </ServiceLabelsColumn>
                    </DayBox>
                  </DayCell>
                );
              })}
            </CalendarRow>
          ));
        })()}

        <Card style={{ marginTop: 18 }}>
          <CardText>Toque em um dia para adicionar um serviço.</CardText>
        </Card>
        {/* Legend: show services that have events */}
        {/* <LegendRow>
          {(() => {
            const usedServiceIds = Array.from(new Set(eventos.map((e) => e.servicoId)));
            const used = servicos.filter((s) => usedServiceIds.includes(s.id));
            return used.map((s) => (
              <LegendItem key={s.id}>
                <LegendColor $color={s.cor} />
                <Text style={{ color: t.textSecondary }}>{s.nome}</Text>
              </LegendItem>
            ));
          })()}
        </LegendRow> */}
      </Container>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        presentationStyle="overFullScreen"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable style={{ flex: 1 }} onPress={handleCloseSheet} />

          <Sheet>
            <SheetSurface>
              <SheetContent
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                contentContainerStyle={{ paddingBottom: 24 }}
              >
              <SheetHeader>
                <SheetTitle>
                  {selectedDate
                    ? format(
                      selectedDate,
                      viewMode ? "d 'de' MMMM" : "d 'de' MMMM 'de' yyyy",
                      { locale: ptBR }
                    )
                    : ''}
                </SheetTitle>
                <CloseButton onPress={handleCloseSheet}>
                  <IconSymbol name="xmark" size={22} color={t.icon} />
                </CloseButton>
              </SheetHeader>

              {viewMode && existingEvent ? (
                /* ── DETAIL VIEW ─────────────────────────────────── */
                <>
                  {selectedDate && (() => {
                    const dayEvs = eventos.filter(
                      (e) => e.data === selectedDate.toISOString().slice(0, 10)
                    );
                    const dayEvsNormalPrimeiro = [...dayEvs].sort((a, b) => {
                      if (normalServicoId && a.servicoId === normalServicoId) return -1;
                      if (normalServicoId && b.servicoId === normalServicoId) return 1;
                      return 0;
                    });
                    return (
                      <EventChipsRow>
                        {dayEvsNormalPrimeiro.map((ev) => {
                          const s = servicos.find((x) => x.id === ev.servicoId);
                          const isSelected = existingEvent?.id === ev.id;
                          return (
                            <EventChip
                              key={ev.id}
                              onPress={() => selectEventToView(ev)}
                              $selected={isSelected}
                              $color={s?.cor}
                            >
                              <EventChipText $selected={isSelected}>
                                {s ? servicoSigla(s.nome, 10) : '—'} • {ev.inicio ?? '—'}
                              </EventChipText>
                            </EventChip>
                          );
                        })}
                        {dayEvs.length < 2 && (
                          <AddServiceIconButton
                            onPress={() => {
                              setExistingEvent(null);
                              setViewMode(false);
                              setServicoId(servicos[0]?.id ?? null);
                              setInicio('07:00');
                              setDuracao(6);
                              setLocal('');
                              setValorInput('');
                              setNotas('');
                            }}
                            accessibilityLabel="Adicionar outro serviço"
                          >
                            <IconSymbol name="plus" size={20} color={t.icon} />
                          </AddServiceIconButton>
                        )}
                      </EventChipsRow>
                    );
                  })()}

                  <DetailSection>
                    <DetailRow>
                      <IconSymbol name="clock" size={18} color={t.icon} />
                      <DetailInfo>
                        <DetailLabel>Horário</DetailLabel>
                        <DetailValue>
                          {existingEvent.inicio ?? '07:00'} -{' '}
                          {computeEndTime(
                            existingEvent.inicio ?? '07:00',
                            existingEvent.duracaoHoras ?? 8
                          )}
                        </DetailValue>
                        <DetailSubValue>
                          Turno: {existingEvent.duracaoHoras ?? 6}h
                        </DetailSubValue>
                      </DetailInfo>
                    </DetailRow>

                    {existingEvent.local?.trim() ? (
                      <>
                        <DetailDivider />
                        <DetailRow>
                          <Entypo name="location-pin" size={18} color={t.icon} />
                          <DetailInfo>
                            <DetailLabel>Local</DetailLabel>
                            <DetailValue>{existingEvent.local}</DetailValue>
                          </DetailInfo>
                        </DetailRow>
                      </>
                    ) : null}

                    {!isNormal(existingEvent?.servicoId) && (() => {
                      const [y, m, d] = existingEvent.data.split('-').map(Number);
                      const [hh, mm] = (existingEvent.inicio ?? '00:00').split(':').map(Number);
                      const inicioEv = new Date(y, m - 1, d, hh, mm ?? 0, 0, 0);
                      const fimEv = addHours(inicioEv, existingEvent.duracaoHoras ?? 0);
                      const jaPassou = fimEv < new Date();
                      return (
                        <>
                          <DetailDivider />
                          <DetailRow>
                            <Entypo name="credit" size={18} color={t.icon} />
                            <DetailInfo>
                              <DetailLabel>{jaPassou ? 'Valor Recebido' : 'Valor Pendente'}</DetailLabel>
                              <DetailValue>{formatBRL(existingEvent.valor)}</DetailValue>
                            </DetailInfo>
                          </DetailRow>
                        </>
                      );
                    })()}
                  </DetailSection>

                  {existingEvent.notas ? (
                    <>
                      <FormLabel style={{ marginTop: 4 }}>Observações</FormLabel>
                      <ObsBox>
                        <ObsText>{existingEvent.notas}</ObsText>
                      </ObsBox>
                    </>
                  ) : null}

                  <AddOccurrenceButton onPress={() => {}}>
                    <AddOccurrenceButtonText>Registrar Ocorrência</AddOccurrenceButtonText>
                  </AddOccurrenceButton>

                  <FullButton onPress={() => setViewMode(false)} style={{ marginTop: 8 }}>
                    <FullButtonText>Editar</FullButtonText>
                  </FullButton>
                </>
              ) : (
                /* ── FORM VIEW ───────────────────────────────────── */
                <>
                  <FormLabel style={{ marginTop: 0 }}>Tipo de Serviçox</FormLabel>
                  <FlexOptionsRow>
                    {servicosNormalPrimeiro.map((s) => {
                      const isSelected = servicoId === s.id;
                      return (
                        <OptionButton
                          key={s.id}
                          onPress={() => setServicoId(s.id)}
                          $selected={isSelected}
                          $color={isSelected ? s.cor : undefined}
                        >
                          <OptionText style={{ color: isSelected ? '#FFF' : t.text }}>
                            {s.nome}
                          </OptionText>
                        </OptionButton>
                      );
                    })}
                  </FlexOptionsRow>

                  <FormLabel>Hora de Início</FormLabel>
                  <TimePressable onPress={openTimePicker}>
                    <TimeText>{inicio}</TimeText>
                    <IconSymbol name="clock" size={18} color={t.icon} />
                  </TimePressable>
                  {Platform.OS === 'ios' && showIOSTimePicker && (
                    <DateTimePicker
                      value={inicioToDate(inicio)}
                      mode="time"
                      display="spinner"
                      locale="pt-BR"
                      is24Hour
                      onChange={(_event, date) => {
                        if (date) {
                          const hh = String(date.getHours()).padStart(2, '0');
                          const mm = String(date.getMinutes()).padStart(2, '0');
                          setInicio(`${hh}:${mm}`);
                        }
                      }}
                      themeVariant="dark"
                      style={{ marginBottom: 4 }}
                      textColor={t.text}
                      accentColor={t.text}
                    />
                  )}

                  <FormLabel>Turno</FormLabel>
                  <OptionsRow>
                    {[6, 8, 12, 24].map((h) => {
                      const servico = servicos.find((s) => s.id === servicoId);
                      const cfg = servico?.turnos?.[h];
                      // turno is disabled only if explicitly set to ativo=false
                      const disabled = cfg?.ativo === false;
                      return (
                        <OptionButton
                          key={h}
                          onPress={() => {
                            if (disabled) return;
                            setDuracao(h);
                            // Ao alterar o turno, preencher com o valor configurado para esse turno
                            if (!isNormal(servicoId) && cfg?.valor != null) {
                              setValorInput(String(cfg.valor).replace('.', ','));
                            } else if (isNormal(servicoId)) {
                              setValorInput('');
                            } else {
                              setValorInput('');
                            }
                          }}
                          $selected={duracao === h}
                          $bg={duracao === h ? t.formButtonBackgroundHover : '#E5E7EB'}
                          $disabled={disabled}
                          $isTurno={true}
                        >
                          <OptionText $muted={disabled}>{h}h</OptionText>
                        </OptionButton>
                      );
                    })}
                  </OptionsRow>

                  <FormLabel>Local (opcional)</FormLabel>
                  <FormInput
                    value={local}
                    onChangeText={(t) => { setLocal(t); setLocalError(''); }}
                    placeholder="Ex: Unidade Centro"
                    placeholderTextColor={t.textSecondary}
                    returnKeyType="next"
                    underlineColorAndroid="transparent"
                  />
                  {localError ? <ErrorText>{localError}</ErrorText> : null}

                  {!isNormal(servicoId) && (
                    <>
                      <FormLabel>Valor Recebido (R$)</FormLabel>
                      <FormInput
                        value={valorInput}
                        onChangeText={(t) => { setValorInput(t); setValorError(''); }}
                        placeholder="0,00"
                        placeholderTextColor={t.textSecondary}
                        keyboardType="decimal-pad"
                        returnKeyType="done"
                        underlineColorAndroid="transparent"
                      />
                      {valorError ? <ErrorText>{valorError}</ErrorText> : null}

                      {/* Alerta quando não há preço configurado para o turno */}
                      {(() => {
                        const servico = servicos.find((s) => s.id === servicoId);
                        const cfg = servico?.turnos?.[duracao];
                        // show tip only when turno is active but has no price
                        const semPreco = cfg?.ativo !== false && cfg?.valor == null;
                        if (!semPreco) return null;
                        return (
                          <PriceTipBox>
                            <PriceTipRow>
                              <Entypo name="warning" size={16} color="#d4a135" />
                              <PriceTipText>
                                Você pode configurar valores para cada turno deste serviço e automatizar o preenchimento.
                              </PriceTipText>
                            </PriceTipRow>
                            <Pressable
                              onPress={() => {
                                closeModal();
                                router.navigate('/(tabs)/servicos');
                              }}
                              style={{ marginLeft: 24 }}
                            >
                              <PriceTipLink>Ir para Configurações de Serviços</PriceTipLink>
                            </Pressable>
                          </PriceTipBox>
                        );
                      })()}
                    </>
                  )}

                  <FormLabel>Observações (opcional)</FormLabel>
                  <MultilineInput
                    value={notas}
                    onChangeText={setNotas}
                    multiline
                    placeholder="Adicione observações..."
                    placeholderTextColor={t.textSecondary}
                    underlineColorAndroid="transparent"
                  />

                  {existingEvent ? (
                    <FormActionsRow>
                      <FormDeleteButton onPress={removeEvento}>
                        <FormDeleteButtonText>Excluir</FormDeleteButtonText>
                      </FormDeleteButton>
                      <FormSaveButton onPress={onSubmit}>
                        <FormSaveButtonText>Salvar</FormSaveButtonText>
                      </FormSaveButton>
                    </FormActionsRow>
                  ) : (
                    <FullButton onPress={onSubmit} style={{ marginTop: 20 }}>
                      <FullButtonText>Adicionar</FullButtonText>
                    </FullButton>
                  )}
                </>
              )}
            </SheetContent>
            </SheetSurface>
          </Sheet>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenContainer>
  );
}
