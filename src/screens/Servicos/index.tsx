import React, { useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  Pressable,
  View,
  Text,
  Alert,
  Keyboard,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useTheme } from 'styled-components/native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useServicoStore } from '@/store/use-servico-store';
import { useEventoStore } from '@/store/use-evento-store';
import { useAlertaStore } from '@/store/use-alerta-store';
import { useScheduleStore } from '@/store/use-escala-store';
import { useSession } from '@/src/contexts/SessionContext';
import { format } from 'date-fns';
import {
  Container,
  HeaderRow,
  HeaderTitle,
  AddButton,
  AddButtonText,
  List,
  ServiceCard,
  ServiceMain,
  ServiceInfo,
  ServiceName,
  ServiceSub,
  ColorSwatch,
  IconButton,
  ServicoModalOverlay,
  ServicoModalSheet,
  FormTitle,
  ServicoModalHeader,
  FormTitleInHeader,
  Label,
  Input,
  ColorGrid,
  ColorButton,
  ErrorText,
  ActionsRow,
  PrimaryButton,
  PrimaryButtonText,
  EscalaCard,
  EscalaCardTopRow,
  EscalaCardLeft,
  EscalaCardIconBox,
  EscalaCardTitle,
  EscalaCardSub,
  EscalaCardConfigBtn,
  EscalaModalOverlay,
  EscalaModalSheet,
  EscalaModalHeader,
  EscalaModalTitle,
  EscalaFieldLabel,
  EscalaDropdownTrigger,
  EscalaDropdownText,
  EscalaDropdownList,
  EscalaDropdownOption,
  EscalaDropdownOptionText,
  EscalaDatePressable,
  EscalaDateText,
  EscalaErrorText,
  EscalaDayRow,
  EscalaDayButton,
  EscalaDayButtonText,
  EscalaActionsRow,
  EscalaSaveButton,
  EscalaSaveButtonText,
  EscalaDeleteButton,
  EscalaDeleteButtonText,
  ServicoDeleteButton,
  ServicoDeleteButtonText,
  TurnoConfigLinkBtn,
  TurnoConfigLinkText,
  DangerButton,
  DangerButtonText,
  ServiceItem,
  ServiceSwipeContent,
  SwipeDeleteAction,
  TurnoConfigBar,
  TurnoConfigLabel,
  TurnoConfigEditBtn,
  TurnoModalSheet,
  TurnoModalHeader,
  TurnoModalTitle,
  TurnoModalSubtitle,
  TurnoModalRow,
  TurnoModalRowHeader,
  TurnoModalRowLabel,
  TurnoModalPriceCard,
  TurnoModalPricePrefix,
  TurnoModalPriceInput,
  TurnoModalTip,
  TurnoModalTipText,
  TurnoModalActions,
  TurnoModalCancelBtn,
  TurnoModalSaveBtn,
  TurnoModalBtnText,
  SwitchTrack,
  SwitchThumb,
} from './styled';
import { ScreenContainer } from '@/src/components/styled/Screen';

const COLORS = [
  '#4DA6FF', '#7ED957', '#F39C12', '#1E5E9B',
  '#9B59FF', '#00C2A8', '#FF8A00', '#FF6BBD',
  '#E74C3C', '#2ECC71', '#E056EF', '#F5A623',
];

import { useSchedule } from '@/hooks/use-escala';
import {
  WEEK_DAYS,
  parseDate,
} from '@/src/utils/escala';

export default function ServicosScreen() {
  const { servicos, addServico, removeServico, updateServico, resetServicos } = useServicoStore();
  const eventos = useEventoStore((s) => s.eventos);
  const removeEvento = useEventoStore((s) => s.removeEvento);
  const resetEventos = useEventoStore((s) => s.resetEventos);
  const resetAlertas = useAlertaStore((s) => s.resetAlertas);
  const { setHasSeenOnboarding } = useSession();
  const { config: scheduleConfig, setConfig: setScheduleConfig, clearConfig: clearScheduleConfig } = useScheduleStore();
  const { workSchedule, getScheduleDef, applySchedule } = useSchedule();
  const t = useTheme();

  // ── service form ──────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState(COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // ── turno modal ───────────────────────────────────
  const TURNO_HORAS = [6, 8, 12, 24];
  type TurnoEntry = { ativo: boolean; valor: string };
  const [showTurnoModal, setShowTurnoModal] = useState(false);
  const [configuringId, setConfiguringId] = useState<string | null>(null);
  const [turnoEntries, setTurnoEntries] = useState<Record<number, TurnoEntry>>({});

  function formatValorTurno(value: number): string {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function openTurnoModal(servicoId: string) {
    const servico = servicos.find((s) => s.id === servicoId);
    const entries: Record<number, TurnoEntry> = {};
    for (const h of TURNO_HORAS) {
      const cfg = servico?.turnos?.[h];
      entries[h] = {
        ativo: cfg === undefined ? true : cfg.ativo,
        valor: cfg?.valor != null ? formatValorTurno(cfg.valor) : '',
      };
    }
    setTurnoEntries(entries);
    setConfiguringId(servicoId);
    setShowTurnoModal(true);
  }

  function saveTurnos() {
    if (!configuringId) return;
    const turnos: Record<number, { ativo: boolean; valor?: number }> = {};
    for (const [hStr, entry] of Object.entries(turnoEntries)) {
      const v = parseFloat(entry.valor.replace(',', '.'));
      turnos[Number(hStr)] = {
        ativo: entry.ativo,
        valor: !isNaN(v) && entry.valor.trim() ? v : undefined,
      };
    }
    updateServico(configuringId, { turnos });
    setShowTurnoModal(false);
    setConfiguringId(null);
  }

  const configuringServico = servicos.find((s) => s.id === configuringId);

  // ── schedule modal ─────────────────────────────────
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleTipo, setScheduleTipo] = useState('12x36');
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date());
  const [scheduleHoraInicio, setScheduleHoraInicio] = useState('07:00');
  const [diaFolhaExtra, setDiaFolhaExtra] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const [showIOSTimePicker, setShowIOSTimePicker] = useState(false);

  // ── service form helpers ──────────────────────────
  const getFirstAvailableColor = () => {
    const used = servicos.map((s) => s.cor.toLowerCase());
    return COLORS.find((c) => !used.includes(c.toLowerCase())) ?? COLORS[0];
  };

  function onResetTudo() {
    Alert.alert(
      'Resetar tudo',
      'Todos os dados serão apagados: eventos, lembretes, escala, configurações de serviços e o onboarding será exibido novamente. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: () => {
            resetEventos();
            resetAlertas();
            clearScheduleConfig();
            resetServicos();
            setHasSeenOnboarding(false);
          },
        },
      ]
    );
  }

  function openAdd() {
    setEditingId(null);
    setNome('');
    setError('');
    setCor(getFirstAvailableColor());
    setShowForm(true);
  }

  function openEdit(id: string, currentNome: string, currentCor: string) {
    setEditingId(id);
    setNome(currentNome);
    setCor(currentCor);
    setError('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setNome('');
    setCor(getFirstAvailableColor());
    setError('');
  }

  function onSave() {
    if (!nome.trim()) return;
    const exists = servicos.some(
      (s) => s.cor.toLowerCase() === cor.toLowerCase() && s.id !== editingId
    );
    if (exists) {
      setError('Já existe um serviço com essa cor. Escolha outra cor.');
      return;
    }
    Keyboard.dismiss();
    if (editingId) {
      updateServico(editingId, { nome: nome.trim(), cor });
    } else {
      addServico({ nome: nome.trim(), cor });
    }
    closeForm();
  }

  // ── schedule modal helpers ────────────────────────
  function horaInicioToDate(s: string): Date {
    const [hh, mm] = s.split(':').map(Number);
    const d = new Date();
    d.setHours(isNaN(hh) ? 7 : hh, isNaN(mm) ? 0 : mm, 0, 0);
    return d;
  }

  function openScheduleTimePicker() {
    setShowDropdown(false);
    setShowIOSPicker(false);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: horaInicioToDate(scheduleHoraInicio),
        onChange: (_event, date) => {
          if (date) {
            const hh = String(date.getHours()).padStart(2, '0');
            const mm = String(date.getMinutes()).padStart(2, '0');
            setScheduleHoraInicio(`${hh}:${mm}`);
          }
        },
        mode: 'time',
        is24Hour: true,
      });
    } else {
      setShowIOSTimePicker((v) => !v);
    }
  }

  function openScheduleModal() {
    if (scheduleConfig) {
      setScheduleTipo(scheduleConfig.tipo);
      setScheduleDate(parseDate(scheduleConfig.dataInicio) ?? new Date());
      setScheduleHoraInicio(scheduleConfig.horaInicio ?? '07:00');
      setDiaFolhaExtra(scheduleConfig.diaFolhaExtra);
    } else {
      setScheduleDate(new Date());
      setScheduleTipo('12x36');
      setScheduleHoraInicio('07:00');
      setDiaFolhaExtra(null);
    }
    setShowDropdown(false);
    setShowIOSPicker(false);
    setShowIOSTimePicker(false);
    setShowScheduleModal(true);
  }

  function openDatePicker() {
    setShowDropdown(false);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: scheduleDate,
        onChange: (_event, date) => {
          if (date) setScheduleDate(date);
        },
        mode: 'date',
        is24Hour: true,
      });
    } else {
      setShowIOSPicker((v) => !v);
    }
  }

  function onRemoveSchedule() {
    const normalServico =
      servicos.find((s) => s.nome.toLowerCase() === 'normal') ?? servicos[0];
    if (normalServico) {
      const toRemove = eventos.filter((e) => e.servicoId === normalServico.id);
      for (const ev of toRemove) removeEvento(ev.id);
    }
    clearScheduleConfig();
    setShowScheduleModal(false);
  }

  function onSaveSchedule() {
    setScheduleConfig({
      tipo: scheduleTipo,
      dataInicio: format(scheduleDate, 'dd/MM/yyyy'),
      horaInicio: scheduleHoraInicio,
      diaFolhaExtra,
    });

    applySchedule({
      startDate: scheduleDate,
      horaInicio: scheduleHoraInicio,
      diaFolhaExtra,
      scheduleDef: getScheduleDef(scheduleTipo),
    });

    setShowScheduleModal(false);
  }

  const selectedScheduleLabel =
    workSchedule.find((s) => s.value === scheduleTipo)?.label ?? '';

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Container>
          <HeaderRow>
            <HeaderTitle>Serviços</HeaderTitle>
            <AddButton onPress={openAdd}>
              <IconSymbol name="plus" size={24} color={t.text} />
            </AddButton>
          </HeaderRow>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Escala de Trabalho card ─────────────── */}
            <Pressable onPress={openScheduleModal}>
              <EscalaCard>
                <EscalaCardTopRow>
                  <EscalaCardLeft>
                    <EscalaCardIconBox>
                      <IconSymbol name="calendar" size={22} color={t.icon} />
                    </EscalaCardIconBox>
                    <EscalaCardTitle>Escala de Trabalho</EscalaCardTitle>
                  </EscalaCardLeft>
                  <EscalaCardConfigBtn onPress={openScheduleModal} accessibilityLabel="Configurar escala">
                    <IconSymbol name="gearshape" size={24} color={t.icon} />
                  </EscalaCardConfigBtn>
                </EscalaCardTopRow>
                <EscalaCardSub>
                  {scheduleConfig
                    ? `${scheduleConfig.tipo} · desde ${scheduleConfig.dataInicio}`
                    : 'Configure sua escala de trabalho para preencher automaticamente os dias'}
                </EscalaCardSub>
              </EscalaCard>
            </Pressable>

            {/* ── Service list ────────────────────────── */}
            <List>
              {servicos.map((s) => {
                const isNormal = s.nome.toLowerCase() === 'normal';
                const content = (
                  <ServiceSwipeContent>
                    <ServiceCard $isNormal={isNormal} onPress={() => openEdit(s.id, s.nome, s.cor)}>
                      <ServiceMain>
                        <ColorSwatch $bg={s.cor} />
                        <ServiceInfo>
                          <ServiceName>{s.nome}</ServiceName>
                        </ServiceInfo>
                      </ServiceMain>
                    </ServiceCard>
                    {!isNormal && (
                      <TurnoConfigBar onPress={() => openTurnoModal(s.id)}>
                        <TurnoConfigLabel>Configurar turnos</TurnoConfigLabel>
                        <TurnoConfigEditBtn onPress={() => openTurnoModal(s.id)}>
                          <IconSymbol name="pencil" size={20} color={t.icon} />
                        </TurnoConfigEditBtn>
                      </TurnoConfigBar>
                    )}
                  </ServiceSwipeContent>
                );
                return (
                  <ServiceItem key={s.id}>
                    {isNormal ? (
                      content
                    ) : (
                      <Swipeable
                        renderRightActions={() => (
                          <SwipeDeleteAction onPress={() => removeServico(s.id)}>
                            <IconSymbol name="trash" size={24} color="#FFF" />
                          </SwipeDeleteAction>
                        )}
                        overshootRight={false}>
                        {content}
                      </Swipeable>
                    )}
                  </ServiceItem>
                );
              })}
            </List>
            {/* <DangerButton onPress={onResetTudo} style={{ marginTop: 24, marginBottom: 8 }}>
              <DangerButtonText>Resetar tudo</DangerButtonText>
            </DangerButton> */}
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>

      {/* ── Novo / Editar Serviço modal (bottom sheet) ─ */}
      <Modal
        visible={showForm}
        transparent
        animationType="slide"
        onRequestClose={closeForm}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={closeForm}>
            <ServicoModalOverlay>
              <TouchableWithoutFeedback onPress={() => {}}>
                <ServicoModalSheet>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                  >
                    <ServicoModalHeader>
                      <FormTitleInHeader>{editingId ? 'Editar Serviço' : 'Novo Serviço'}</FormTitleInHeader>
                      <IconButton onPress={closeForm}>
                        <IconSymbol name="xmark" size={22} color={t.icon} />
                      </IconButton>
                    </ServicoModalHeader>

                    <Label>Nome do Serviço</Label>
                    <Input
                      value={nome}
                      onChangeText={setNome}
                      placeholder="Ex: Plantão, Extra..."
                      placeholderTextColor={t.textSecondary}
                      returnKeyType="done"
                    />

                    <Label>Cor</Label>
                    <ColorGrid>
                      {COLORS.map((c) => {
                        const used = servicos.some(
                          (s) => s.cor.toLowerCase() === c.toLowerCase() && s.id !== editingId
                        );
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
                      {editingId && servicos.find((s) => s.id === editingId)?.nome.toLowerCase() !== 'normal' ? (
                        <>
                          <ServicoDeleteButton
                            onPress={() => {
                              removeServico(editingId);
                              closeForm();
                            }}
                          >
                            <ServicoDeleteButtonText>Excluir</ServicoDeleteButtonText>
                          </ServicoDeleteButton>
                          <PrimaryButton onPress={onSave}>
                            <PrimaryButtonText>Salvar</PrimaryButtonText>
                          </PrimaryButton>
                        </>
                      ) : (
                        <PrimaryButton onPress={onSave} style={{ flex: 1 }}>
                          <PrimaryButtonText>Adicionar</PrimaryButtonText>
                        </PrimaryButton>
                      )}
                    </ActionsRow>
                  </ScrollView>
                </ServicoModalSheet>
              </TouchableWithoutFeedback>
            </ServicoModalOverlay>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Configurar Escala modal ─────────────────── */}
      <Modal
        visible={showScheduleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowScheduleModal(false)}
      >
        {/* Dark overlay fills top area and closes modal on tap */}
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <TouchableWithoutFeedback onPress={() => setShowScheduleModal(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          {/* KeyboardAvoidingView wraps only the sheet so it lifts above keyboard */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <EscalaModalSheet>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <EscalaModalHeader>
                  <EscalaModalTitle>Configurar Escala</EscalaModalTitle>
                  <IconButton onPress={() => setShowScheduleModal(false)}>
                    <IconSymbol name="xmark" size={20} color={t.icon} />
                  </IconButton>
                </EscalaModalHeader>

                {/* Tipo de escala */}
                <EscalaFieldLabel>Tipo de Escala</EscalaFieldLabel>
                <EscalaDropdownTrigger onPress={() => { setShowIOSPicker(false); setShowDropdown((v) => !v); }}>
                  <EscalaDropdownText>{selectedScheduleLabel}</EscalaDropdownText>
                  <IconSymbol
                    name={showDropdown ? 'chevron.up' : 'chevron.down'}
                    size={16}
                    color={t.icon}
                  />
                </EscalaDropdownTrigger>

                {showDropdown && (
                  <EscalaDropdownList>
                    {workSchedule.map((opt) => (
                      <EscalaDropdownOption
                        key={opt.value}
                        $selected={scheduleTipo === opt.value}
                        onPress={() => {
                          setScheduleTipo(opt.value);
                          setShowDropdown(false);
                        }}
                      >
                        <EscalaDropdownOptionText $selected={scheduleTipo === opt.value}>
                          {opt.label}
                        </EscalaDropdownOptionText>
                      </EscalaDropdownOption>
                    ))}
                  </EscalaDropdownList>
                )}

                {/* Data de início */}
                <EscalaFieldLabel style={{ marginTop: 14 }}>
                  Data de Início (primeiro dia de trabalho)
                </EscalaFieldLabel>
                <EscalaDatePressable onPress={openDatePicker}>
                  <EscalaDateText>{format(scheduleDate, 'dd/MM/yyyy')}</EscalaDateText>
                  <IconSymbol name="calendar" size={18} color={t.icon} />
                </EscalaDatePressable>

                {/* iOS inline date picker */}
                {Platform.OS === 'ios' && showIOSPicker && (
                  <DateTimePicker
                    value={scheduleDate}
                    mode="date"
                    display="spinner"
                    locale="pt-BR"
                    onChange={(_event, date) => {
                      if (date) setScheduleDate(date);
                    }}
                    themeVariant="dark"
                    style={{ marginBottom: 8 }}
                    textColor={t.text}
                    accentColor={t.text}
                  />
                )}

                {/* Hora de início */}
                <EscalaFieldLabel style={{ marginTop: 14 }}>
                  Hora de Início
                </EscalaFieldLabel>
                <EscalaDatePressable onPress={openScheduleTimePicker}>
                  <EscalaDateText>{scheduleHoraInicio}</EscalaDateText>
                  <IconSymbol name="clock" size={18} color={t.icon} />
                </EscalaDatePressable>

                {/* iOS inline time picker */}
                {Platform.OS === 'ios' && showIOSTimePicker && (
                  <DateTimePicker
                    value={horaInicioToDate(scheduleHoraInicio)}
                    mode="time"
                    display="spinner"
                    locale="pt-BR"
                    is24Hour
                    onChange={(_event, date) => {
                      if (date) {
                        const hh = String(date.getHours()).padStart(2, '0');
                        const mm = String(date.getMinutes()).padStart(2, '0');
                        setScheduleHoraInicio(`${hh}:${mm}`);
                      }
                    }}
                    themeVariant="dark"
                    style={{ marginBottom: 8 }}
                    textColor={t.text}
                    accentColor={t.text}
                  />
                )}

                {/* Dia extra de folga */}
                <EscalaFieldLabel style={{ marginTop: 14 }}>
                  Dia extra de folga (opcional)
                </EscalaFieldLabel>
                <EscalaDayRow>
                  {WEEK_DAYS.map((day) => (
                    <EscalaDayButton
                      key={day.value}
                      $selected={diaFolhaExtra === day.value}
                      onPress={() =>
                        setDiaFolhaExtra(diaFolhaExtra === day.value ? null : day.value)
                      }
                    >
                      <EscalaDayButtonText $selected={diaFolhaExtra === day.value}>
                        {day.label}
                      </EscalaDayButtonText>
                    </EscalaDayButton>
                  ))}
                </EscalaDayRow>

                {scheduleConfig ? (
                  <EscalaActionsRow>
                    <EscalaDeleteButton onPress={onRemoveSchedule}>
                      <EscalaDeleteButtonText>Excluir</EscalaDeleteButtonText>
                    </EscalaDeleteButton>
                    <EscalaSaveButton $flex onPress={onSaveSchedule}>
                      <EscalaSaveButtonText>Salvar</EscalaSaveButtonText>
                    </EscalaSaveButton>
                  </EscalaActionsRow>
                ) : (
                  <EscalaSaveButton onPress={onSaveSchedule} style={{ marginTop: 8 }}>
                    <EscalaSaveButtonText>Salvar Escala</EscalaSaveButtonText>
                  </EscalaSaveButton>
                )}
              </ScrollView>
            </EscalaModalSheet>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ── Modal Configurar Turnos ──────────────────── */}
      <Modal
        visible={showTurnoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTurnoModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <TouchableWithoutFeedback onPress={() => setShowTurnoModal(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TurnoModalSheet>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <TurnoModalHeader>
                  <TurnoModalTitle>Configurar Turnos</TurnoModalTitle>
                  <IconButton onPress={() => setShowTurnoModal(false)}>
                    <IconSymbol name="xmark" size={20} color={t.icon} />
                  </IconButton>
                </TurnoModalHeader>

                <TurnoModalSubtitle>
                  Configure os turnos disponíveis e valores para{' '}
                  <Text style={{ fontWeight: '700', color: t.text }}>
                    {configuringServico?.nome}
                  </Text>
                </TurnoModalSubtitle>

                {TURNO_HORAS.map((h) => {
                  const entry = turnoEntries[h] ?? { ativo: true, valor: '' };
                  return (
                    <TurnoModalRow key={h}>
                      <TurnoModalRowHeader>
                        <TurnoModalRowLabel>Turno {h}h</TurnoModalRowLabel>
                        <SwitchTrack
                          $on={entry.ativo}
                          onPress={() =>
                            setTurnoEntries((prev) => ({
                              ...prev,
                              [h]: { ...prev[h], ativo: !prev[h]?.ativo },
                            }))
                          }
                        >
                          <SwitchThumb />
                        </SwitchTrack>
                      </TurnoModalRowHeader>

                      {entry.ativo && (
                        <TurnoModalPriceCard>
                          <TurnoModalPricePrefix>R$</TurnoModalPricePrefix>
                          <TurnoModalPriceInput
                            value={entry.valor}
                            onChangeText={(v) =>
                              setTurnoEntries((prev) => ({
                                ...prev,
                                [h]: { ...prev[h], valor: v },
                              }))
                            }
                            placeholder="Valor (opcional)"
                            placeholderTextColor={t.textSecondary}
                            keyboardType="decimal-pad"
                            returnKeyType="done"
                          />
                        </TurnoModalPriceCard>
                      )}
                    </TurnoModalRow>
                  );
                })}

                <TurnoModalTip>
                  <TurnoModalTipText>
                    Desabilite os turnos que não são utilizados neste serviço.
                  </TurnoModalTipText>
                </TurnoModalTip>

                <TurnoModalActions>
                  <TurnoModalSaveBtn onPress={saveTurnos} style={{ flex: 1 }}>
                    <TurnoModalBtnText>Salvar</TurnoModalBtnText>
                  </TurnoModalSaveBtn>
                </TurnoModalActions>
              </ScrollView>
            </TurnoModalSheet>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
