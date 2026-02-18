import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Modal, Platform, Keyboard } from 'react-native';
import {
  format,
  startOfMonth,
  startOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEventoStore } from '@/store/use-evento-store';
import { useServicoStore } from '@/store/use-servico-store';
import {
  Container,
  HeaderRow,
  MonthTitle,
  WeekRow,
  CalendarRow,
  DayCell,
  DayBox,
  DayText,
  Dot,
  NavButton,
  NavButtonText,
  WeekDayText,
  OverlayPressable,
  Sheet,
  SheetContent,
  SheetHandle,
  SheetHeader,
  SheetTitle,
  CloseButton,
  CloseButtonText,
  DetailBadge,
  DetailBadgeText,
  DetailSection,
  DetailRow,
  DetailDivider,
  DetailIconText,
  DetailInfo,
  DetailLabel,
  DetailValue,
  DetailSubValue,
  PaymentToggle,
  PaymentCircle,
  PaymentInfo,
  PaymentTitle,
  PaymentSubTitle,
  ObsBox,
  ObsText,
  FullButton,
  FullButtonText,
  DangerButton,
  DangerButtonText,
  FormLabel,
  FlexOptionsRow,
  OptionsRow,
  OptionButton,
  OptionText,
  FormInput,
  MultilineInput,
  ErrorText,
  LegendRow,
  LegendItem,
  LegendColor,
} from './styled';
import { ScreenContainer, Card, CardText } from '@/src/components/styled';

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

function formatCurrency(value?: number) {
  if (value == null || isNaN(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function AgendaScreen() {
  const [month, setMonth] = useState(new Date());
  const matrix = useMemo(() => buildMonthMatrix(month), [month]);
  const eventos = useEventoStore((s) => s.eventos);
  const servicos = useServicoStore((s) => s.servicos);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [existingEvent, setExistingEvent] = useState<any | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // form fields
  const [servicoId, setServicoId] = useState<string | null>(null);
  const [inicio, setInicio] = useState('07:00');
  const [duracao, setDuracao] = useState(8);
  const [local, setLocal] = useState('');
  const [valorInput, setValorInput] = useState('');
  const [pago, setPago] = useState(false);
  const [notas, setNotas] = useState('');
  const [localError, setLocalError] = useState('');
  const [valorError, setValorError] = useState('');

  useEffect(() => {
    const showEv = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEv = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const onShow = (e: any) => setKeyboardHeight(e.endCoordinates?.height ?? 300);
    const onHide = () => setKeyboardHeight(0);
    const sub1 = Keyboard.addListener(showEv, onShow);
    const sub2 = Keyboard.addListener(hideEv, onHide);
    return () => { sub1.remove(); sub2.remove(); };
  }, []);

  function computeEndTime(inicioStr: string, horas: number) {
    const [hh, mm] = inicioStr.split(':').map(Number);
    if (isNaN(hh)) return '--:--';
    const endHour = (hh + horas) % 24;
    return `${String(endHour).padStart(2, '0')}:${String(mm || 0).padStart(2, '0')}`;
  }

  function openFor(date: Date) {
    setSelectedDate(date);
    const data = date.toISOString().slice(0, 10);
    const found = useEventoStore.getState().eventos.find((e) => e.data === data) ?? null;
    setExistingEvent(found);
    setLocalError('');
    setValorError('');

    if (found) {
      setServicoId(found.servicoId ?? servicos[0]?.id ?? null);
      setInicio(found.inicio ?? '07:00');
      setDuracao(found.duracaoHoras ?? 8);
      setLocal(found.local ?? '');
      setValorInput(found.valor != null ? String(found.valor) : '');
      setPago(!!found.pago);
      setNotas(found.notas ?? '');
      setViewMode(true);
    } else {
      setServicoId(servicos[0]?.id ?? null);
      setInicio('07:00');
      setDuracao(8);
      setLocal('');
      setValorInput('');
      setPago(false);
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
  }

  function onSubmit() {
    setLocalError('');
    setValorError('');
    if (!local.trim()) {
      setLocalError('Informe um local');
      return;
    }
    const normalized = valorInput.replace(/\./g, '').replace(',', '.').trim();
    const valorNum = normalized ? Number(normalized) : 0;
    if (isNaN(valorNum)) {
      setValorError('Valor inválido');
      return;
    }
    const data = selectedDate
      ? selectedDate.toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);
    const payload = {
      data,
      servicoId: servicoId ?? servicos[0]?.id ?? '',
      inicio,
      duracaoHoras: duracao,
      local,
      valor: valorNum,
      pago,
      notas,
    };
    if (existingEvent) {
      useEventoStore.getState().updateEvento(existingEvent.id, payload);
    } else {
      useEventoStore.getState().addEvento(payload);
    }
    closeModal();
  }

  function removeEvento() {
    if (!existingEvent) return;
    useEventoStore.getState().removeEvento(existingEvent.id);
    closeModal();
  }

  function togglePago() {
    const next = !pago;
    setPago(next);
    if (existingEvent && viewMode) {
      useEventoStore.getState().updateEvento(existingEvent.id, { pago: next });
    }
  }

  const currentServico = servicos.find(
    (s) => s.id === (viewMode ? existingEvent?.servicoId : servicoId)
  );

  return (
    <ScreenContainer>
      <Container>
        <HeaderRow>
          <NavButton onPress={() => setMonth(subMonths(month, 1))}>
            <NavButtonText>{'<'}</NavButtonText>
          </NavButton>
          <MonthTitle>{format(month, 'MMMM yyyy', { locale: ptBR })}</MonthTitle>
          <NavButton onPress={() => setMonth(addMonths(month, 1))}>
            <NavButtonText>{'>'}</NavButtonText>
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
                const isCurrentMonth = isSameMonth(d, month);
                const isToday = isSameDay(d, new Date());
                const primaryColor = servicos.find(
                  (x) => x.id === dayEvents[0]?.servicoId
                )?.cor;
                return (
                  <DayCell key={i} onPress={() => openFor(d)} $opacity={isCurrentMonth ? 1 : 0.4}>
                    <DayBox
                      $isToday={isToday}
                      $borderColor={dayEvents.length > 0 ? primaryColor : undefined}
                    >
                      <DayText $isToday={isToday} $shiftUp={dayEvents.length > 0}>
                        {format(d, 'd')}
                      </DayText>
                      {dayEvents.length > 0 ? <Dot $color={primaryColor} /> : null}
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
        <LegendRow>
          {(() => {
            const usedServiceIds = Array.from(new Set(eventos.map((e) => e.servicoId)));
            const used = servicos.filter((s) => usedServiceIds.includes(s.id));
            return (
              <>
                <LegendItem>
                  <LegendColor $color="#0B5FFF" />
                  <Text style={{ color: '#DDD' }}>Dia Atual</Text>
                </LegendItem>
                {used.map((s) => (
                  <LegendItem key={s.id}>
                    <LegendColor $color={s.cor} />
                    <Text style={{ color: '#DDD' }}>{s.nome}</Text>
                  </LegendItem>
                ))}
              </>
            );
          })()}
        </LegendRow>
      </Container>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        presentationStyle="overFullScreen"
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1 }}>
          <OverlayPressable onPress={closeModal} />

          {/* Sheet sobe junto com o teclado sem usar KeyboardAvoidingView */}
          <Sheet style={{ bottom: keyboardHeight }}>
            <SheetContent
              nestedScrollEnabled
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="none"
              contentContainerStyle={{ paddingBottom: 36 }}
            >
              <SheetHandle />

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
                <CloseButton onPress={closeModal}>
                  <CloseButtonText>✕</CloseButtonText>
                </CloseButton>
              </SheetHeader>

              {viewMode && existingEvent ? (
                /* ── DETAIL VIEW ─────────────────────────────────── */
                <>
                  <DetailBadge $color={currentServico?.cor}>
                    <DetailBadgeText>
                      {currentServico?.nome ?? 'Serviço'} • {existingEvent.duracaoHoras ?? 8}h
                    </DetailBadgeText>
                  </DetailBadge>

                  <DetailSection>
                    <DetailRow>
                      <DetailIconText>⏱</DetailIconText>
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
                          Turno: {existingEvent.duracaoHoras ?? 8}h
                        </DetailSubValue>
                      </DetailInfo>
                    </DetailRow>

                    <DetailDivider />

                    <DetailRow>
                      <DetailIconText>📍</DetailIconText>
                      <DetailInfo>
                        <DetailLabel>Local</DetailLabel>
                        <DetailValue>{existingEvent.local || '—'}</DetailValue>
                      </DetailInfo>
                    </DetailRow>

                    <DetailDivider />

                    <DetailRow>
                      <DetailIconText>💰</DetailIconText>
                      <DetailInfo>
                        <DetailLabel>Valor Recebido</DetailLabel>
                        <DetailValue>{formatCurrency(existingEvent.valor)}</DetailValue>
                      </DetailInfo>
                    </DetailRow>
                  </DetailSection>

                  <PaymentToggle onPress={togglePago} $pago={pago}>
                    <PaymentCircle $checked={pago}>
                      {pago ? (
                        <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>
                          ✓
                        </Text>
                      ) : null}
                    </PaymentCircle>
                    <PaymentInfo>
                      <PaymentTitle>{pago ? 'Pago' : 'Pagamento Pendente'}</PaymentTitle>
                      <PaymentSubTitle>
                        {pago
                          ? 'Toque para marcar como pendente'
                          : 'Toque para marcar como pago'}
                      </PaymentSubTitle>
                    </PaymentInfo>
                  </PaymentToggle>

                  {existingEvent.notas ? (
                    <>
                      <FormLabel style={{ marginTop: 4 }}>Observações</FormLabel>
                      <ObsBox>
                        <ObsText>{existingEvent.notas}</ObsText>
                      </ObsBox>
                    </>
                  ) : null}

                  <FullButton onPress={() => setViewMode(false)} style={{ marginTop: 8 }}>
                    <FullButtonText>Editar Informações</FullButtonText>
                  </FullButton>

                  <DangerButton onPress={removeEvento}>
                    <DangerButtonText>Desmarcar</DangerButtonText>
                  </DangerButton>
                </>
              ) : (
                /* ── FORM VIEW ───────────────────────────────────── */
                <>
                  <FormLabel style={{ marginTop: 0 }}>Tipo de Serviço</FormLabel>
                  <FlexOptionsRow>
                    {servicos.map((s) => (
                      <OptionButton
                        key={s.id}
                        onPress={() => setServicoId(s.id)}
                        $selected={servicoId === s.id}
                        $bg={s.cor}
                      >
                        <OptionText style={{ color: servicoId === s.id ? '#000' : '#FFF' }}>
                          {s.nome}
                        </OptionText>
                      </OptionButton>
                    ))}
                  </FlexOptionsRow>

                  <FormLabel>Hora de Início</FormLabel>
                  <FormInput
                    value={inicio}
                    onChangeText={setInicio}
                    placeholder="07:00"
                    placeholderTextColor="#555"
                    keyboardType="numbers-and-punctuation"
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                  />

                  <FormLabel>Turno</FormLabel>
                  <OptionsRow>
                    {[6, 8, 12, 24].map((h) => (
                      <OptionButton
                        key={h}
                        onPress={() => setDuracao(h)}
                        $selected={duracao === h}
                        $bg="#0B5FFF"
                      >
                        <OptionText>{h}h</OptionText>
                      </OptionButton>
                    ))}
                  </OptionsRow>

                  <FormLabel>Hora de Término (calculada)</FormLabel>
                  <FormInput
                    value={computeEndTime(inicio, duracao)}
                    editable={false}
                    style={{ opacity: 0.55 }}
                    placeholderTextColor="#555"
                    underlineColorAndroid="transparent"
                  />

                  <FormLabel>Local</FormLabel>
                  <FormInput
                    value={local}
                    onChangeText={(t) => { setLocal(t); setLocalError(''); }}
                    placeholder="Ex: Unidade Centro"
                    placeholderTextColor="#555"
                    returnKeyType="next"
                    underlineColorAndroid="transparent"
                  />
                  {localError ? <ErrorText>{localError}</ErrorText> : null}

                  <FormLabel>Valor Recebido (R$)</FormLabel>
                  <FormInput
                    value={valorInput}
                    onChangeText={(t) => { setValorInput(t); setValorError(''); }}
                    placeholder="0,00"
                    placeholderTextColor="#555"
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                  />
                  {valorError ? <ErrorText>{valorError}</ErrorText> : null}

                  <FormLabel>Status do Pagamento</FormLabel>
                  <PaymentToggle onPress={() => setPago(!pago)} $pago={pago}>
                    <PaymentCircle $checked={pago}>
                      {pago ? (
                        <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>
                          ✓
                        </Text>
                      ) : null}
                    </PaymentCircle>
                    <PaymentInfo>
                      <PaymentTitle>{pago ? 'Pago' : 'Pagamento Pendente'}</PaymentTitle>
                    </PaymentInfo>
                  </PaymentToggle>

                  <FormLabel>Observações (opcional)</FormLabel>
                  <MultilineInput
                    value={notas}
                    onChangeText={setNotas}
                    multiline
                    placeholder="Adicione observações..."
                    placeholderTextColor="#555"
                    underlineColorAndroid="transparent"
                  />

                  <FullButton onPress={onSubmit} style={{ marginTop: 20 }}>
                    <FullButtonText>
                      {existingEvent ? '💾  Salvar Alterações' : '＋  Adicionar'}
                    </FullButtonText>
                  </FullButton>
                </>
              )}
            </SheetContent>
          </Sheet>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
