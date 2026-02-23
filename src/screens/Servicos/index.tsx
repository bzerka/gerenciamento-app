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
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useTheme } from 'styled-components/native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useServicoStore } from '@/store/use-servico-store';
import { useEventoStore } from '@/store/use-evento-store';
import { useAlertaStore } from '@/store/use-alerta-store';
import { useEscalaStore } from '@/store/use-escala-store';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { addDays, addMonths, format } from 'date-fns';
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
  FormCard,
  FormTitle,
  Label,
  Input,
  ColorGrid,
  ColorButton,
  ErrorText,
  ActionsRow,
  CancelButton,
  PrimaryButton,
  PrimaryButtonText,
  EscalaCard,
  EscalaCardTopRow,
  EscalaCardLeft,
  EscalaCardIconBox,
  EscalaCardTitle,
  EscalaCardSub,
  EscalaCardConfigBtn,
  EscalaCardConfigBtnText,
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
  EscalaSaveButton,
  EscalaSaveButtonText,
  DangerButton,
  DangerButtonText,
  ServiceItem,
  TurnoConfigBar,
  TurnoConfigLabel,
  TurnoConfigEditBtn,
  TurnoConfigEditText,
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

const SCALE_TYPES = [
  { value: '12x36', label: '12x36 (12h trabalho, 36h folga)' },
  { value: '12x48', label: '12x48 (12h trabalho, 48h folga)' },
  { value: '12x60', label: '12x60 (12h trabalho, 60h folga)' },
  { value: '24x48', label: '24x48 (24h trabalho, 48h folga)' },
  { value: '24x72', label: '24x72 (24h trabalho, 72h folga)' },
  { value: '24x96', label: '24x96 (24h trabalho, 96h folga)' },
  { value: '12x24x12x72', label: '12x24x12x72 (alternado)' },
];

const WEEK_DAYS = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sáb' },
];

function parseDate(str: string): Date | null {
  const parts = str.split('/');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y || y < 2000 || y > 2100) return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

function generateWorkDays(
  tipo: string,
  startDate: Date,
  diaFolhaExtra: number | null,
): Date[] {
  const endDate = addMonths(startDate, 5);
  const days: Date[] = [];
  let current = new Date(startDate);
  let offset = 0;

  while (current <= endDate) {
    let isWork = false;
    const dow = current.getDay();
    const o = offset;

    switch (tipo) {
      // 12h trabalho + 36h folga = ciclo 48h = 2 dias → 1 dia sim, 1 não
      case '12x36':
        isWork = o % 2 === 0;
        break;
      // 12h + 48h = 60h = 2,5 dias → LCM 5 dias, 2 plantões: dias 0 e 2
      case '12x48':
        isWork = o % 5 === 0 || o % 5 === 2;
        break;
      // 12h + 60h = 72h = 3 dias → 1 dia sim, 2 não
      case '12x60':
        isWork = o % 3 === 0;
        break;
      // 24h + 48h = 72h = 3 dias → 1 dia sim, 2 não
      case '24x48':
        isWork = o % 3 === 0;
        break;
      // 24h + 72h = 96h = 4 dias → 1 dia sim, 3 não
      case '24x72':
        isWork = o % 4 === 0;
        break;
      // 24h + 96h = 120h = 5 dias → 1 dia sim, 4 não
      case '24x96':
        isWork = o % 5 === 0;
        break;
      // 12h + 24h + 12h + 72h = 120h = 5 dias → 2 plantões: dias 0 e 1
      case '12x24x12x72':
        isWork = o % 5 === 0 || o % 5 === 1;
        break;
      default:
        isWork = o % 2 === 0;
    }

    if (diaFolhaExtra !== null && dow === diaFolhaExtra) isWork = false;
    if (isWork) days.push(new Date(current));

    current = addDays(current, 1);
    offset++;
  }

  return days;
}

function turnoHoursForTipo(tipo: string): number {
  switch (tipo) {
    case '12x36':
    case '12x48':
    case '12x60':
    case '12x24x12x72':
      return 12;
    case '24x48':
    case '24x72':
    case '24x96':
      return 24;
    case '5x2':
    case '6x1':
    default:
      return 8;
  }
}

export default function ServicosScreen() {
  const { servicos, addServico, removeServico, updateServico, resetServicos } = useServicoStore();
  const eventos = useEventoStore((s) => s.eventos);
  const addEvento = useEventoStore((s) => s.addEvento);
  const removeEvento = useEventoStore((s) => s.removeEvento);
  const resetEventos = useEventoStore((s) => s.resetEventos);
  const resetAlertas = useAlertaStore((s) => s.resetAlertas);
  const setHasSeenOnboarding = useOnboardingStore((s) => s.setHasSeenOnboarding);
  const { config: escalaConfig, setConfig: setEscalaConfig, clearConfig: clearEscalaConfig } = useEscalaStore();
  const t = useTheme();

  // ── service form ──────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState(COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  // ── turno modal ───────────────────────────────────
  const TURNO_HORAS = [6, 8, 12, 24];
  type TurnoEntry = { ativo: boolean; valor: string };
  const [showTurnoModal, setShowTurnoModal] = useState(false);
  const [configuringId, setConfiguringId] = useState<string | null>(null);
  const [turnoEntries, setTurnoEntries] = useState<Record<number, TurnoEntry>>({});

  function openTurnoModal(servicoId: string) {
    const servico = servicos.find((s) => s.id === servicoId);
    const entries: Record<number, TurnoEntry> = {};
    for (const h of TURNO_HORAS) {
      const cfg = servico?.turnos?.[h];
      entries[h] = {
        ativo: cfg === undefined ? true : cfg.ativo,
        valor: cfg?.valor != null ? String(cfg.valor) : '',
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

  // ── escala modal ──────────────────────────────────
  const [showEscalaModal, setShowEscalaModal] = useState(false);
  const [escalaTipo, setEscalaTipo] = useState('12x36');
  const [escalaDate, setEscalaDate] = useState<Date>(new Date());
  const [escalaHoraInicio, setEscalaHoraInicio] = useState('07:00');
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
      'Todos os dados serão apagados: eventos, alertas, escala, configurações de serviços e o onboarding será exibido novamente. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: () => {
            resetEventos();
            resetAlertas();
            clearEscalaConfig();
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
    if (editingId) {
      updateServico(editingId, { nome: nome.trim(), cor });
    } else {
      addServico({ nome: nome.trim(), cor });
    }
    closeForm();
  }

  // ── escala modal helpers ──────────────────────────
  function horaInicioToDate(s: string): Date {
    const [hh, mm] = s.split(':').map(Number);
    const d = new Date();
    d.setHours(isNaN(hh) ? 7 : hh, isNaN(mm) ? 0 : mm, 0, 0);
    return d;
  }

  function openEscalaTimePicker() {
    setShowDropdown(false);
    setShowIOSPicker(false);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: horaInicioToDate(escalaHoraInicio),
        onChange: (_event, date) => {
          if (date) {
            const hh = String(date.getHours()).padStart(2, '0');
            const mm = String(date.getMinutes()).padStart(2, '0');
            setEscalaHoraInicio(`${hh}:${mm}`);
          }
        },
        mode: 'time',
        is24Hour: true,
      });
    } else {
      setShowIOSTimePicker((v) => !v);
    }
  }

  function openEscalaModal() {
    if (escalaConfig) {
      setEscalaTipo(escalaConfig.tipo);
      setEscalaDate(parseDate(escalaConfig.dataInicio) ?? new Date());
      setEscalaHoraInicio(escalaConfig.horaInicio ?? '07:00');
      setDiaFolhaExtra(escalaConfig.diaFolhaExtra);
    } else {
      setEscalaDate(new Date());
      setEscalaTipo('12x36');
      setEscalaHoraInicio('07:00');
      setDiaFolhaExtra(null);
    }
    setShowDropdown(false);
    setShowIOSPicker(false);
    setShowIOSTimePicker(false);
    setShowEscalaModal(true);
  }

  function openDatePicker() {
    setShowDropdown(false); // close dropdown when opening date picker
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: escalaDate,
        onChange: (_event, date) => {
          if (date) setEscalaDate(date);
        },
        mode: 'date',
        is24Hour: true,
      });
    } else {
      setShowIOSPicker((v) => !v);
    }
  }

  function onRemoveEscala() {
    const normalServico =
      servicos.find((s) => s.nome.toLowerCase() === 'normal') ?? servicos[0];
    if (normalServico) {
      const toRemove = eventos.filter((e) => e.servicoId === normalServico.id);
      for (const ev of toRemove) removeEvento(ev.id);
    }
    clearEscalaConfig();
    setShowEscalaModal(false);
  }

  function onSaveEscala() {
    const startDate = escalaDate;

    // persist config
    setEscalaConfig({
      tipo: escalaTipo,
      dataInicio: format(startDate, 'dd/MM/yyyy'),
      horaInicio: escalaHoraInicio,
      diaFolhaExtra,
    });

    const normalServico =
      servicos.find((s) => s.nome.toLowerCase() === 'normal') ?? servicos[0];
    if (!normalServico) {
      setShowEscalaModal(false);
      return;
    }

    // compute target window (start .. +5 months)
    const endDate = addMonths(startDate, 5);
    const startStr = format(startDate, 'yyyy-MM-dd');
    const endStr = format(endDate, 'yyyy-MM-dd');

    // Remove all existing 'normal' events in window to avoid residues.
    const toRemove = eventos.filter(
      (e) => e.servicoId === normalServico.id && e.data >= startStr && e.data <= endStr
    );
    const removedIds = new Set<string>();
    for (const ev of toRemove) {
      removeEvento(ev.id);
      removedIds.add(ev.id);
    }

    // Build set of remaining dates to skip duplicates.
    const existingDates = new Set(
      eventos
        .filter((e) => e.servicoId === normalServico.id && !removedIds.has(e.id))
        .map((e) => e.data)
    );

    const turno = turnoHoursForTipo(escalaTipo);
    const workDays = generateWorkDays(escalaTipo, startDate, diaFolhaExtra);
    for (const day of workDays) {
      const dateStr = format(day, 'yyyy-MM-dd');
      if (!existingDates.has(dateStr)) {
        addEvento({ data: dateStr, servicoId: normalServico.id, duracaoHoras: turno, inicio: escalaHoraInicio });
        existingDates.add(dateStr);
      }
    }

    setShowEscalaModal(false);
  }

  const selectedScaleLabel =
    SCALE_TYPES.find((s) => s.value === escalaTipo)?.label ?? '';

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Container>
          <HeaderRow>
            <HeaderTitle>Serviços</HeaderTitle>
            {!showForm && (
              <AddButton onPress={openAdd}>
                <IconSymbol name="plus" size={24} color={t.text} />
                {/* <AddButtonText>Adicionar</AddButtonText> */}
              </AddButton>
            )}
          </HeaderRow>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Escala de Trabalho card ─────────────── */}
            <Pressable onPress={openEscalaModal}>
              <EscalaCard>
                <EscalaCardTopRow>
                  <EscalaCardLeft>
                    <EscalaCardIconBox>
                      <IconSymbol name="calendar" size={22} color={t.icon} />
                    </EscalaCardIconBox>
                    <EscalaCardTitle>Escala de Trabalho</EscalaCardTitle>
                  </EscalaCardLeft>
                  <EscalaCardConfigBtn onPress={openEscalaModal}>
                    <EscalaCardConfigBtnText>Configurar</EscalaCardConfigBtnText>
                  </EscalaCardConfigBtn>
                </EscalaCardTopRow>
                <EscalaCardSub>
                  {escalaConfig
                    ? `${escalaConfig.tipo} · desde ${escalaConfig.dataInicio}`
                    : 'Configure sua escala de trabalho para preencher automaticamente os dias'}
                </EscalaCardSub>
              </EscalaCard>
            </Pressable>

            {/* ── New / edit service form ─────────────── */}
            {showForm && (
              <FormCard>
                <FormTitle>{editingId ? 'Editar Serviço' : 'Novo Serviço'}</FormTitle>

                <Label>Nome do Serviço</Label>
                <Input
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Ex: Plantão, Extra..."
                  placeholderTextColor="#555"
                  $focused={inputFocused}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  returnKeyType="done"
                  autoFocus
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
                  <CancelButton onPress={closeForm}>
                    {/* <IconSymbol name="xmark" size={16} color="#fff" /> */}
                    <PrimaryButtonText>Cancelar</PrimaryButtonText>
                  </CancelButton>
                  <PrimaryButton onPress={onSave}>
                    {/* <IconSymbol name="checkmark" size={16} color="#fff" /> */}
                    <PrimaryButtonText>{editingId ? 'Salvar' : 'Adicionar'}</PrimaryButtonText>
                  </PrimaryButton>
                </ActionsRow>
              </FormCard>
            )}

            {/* ── Service list ────────────────────────── */}
            <List>
              {servicos.map((s) => {
                const isNormal = s.nome.toLowerCase() === 'normal';
                return (
                  <ServiceItem key={s.id}>
                    <ServiceCard>
                      <ServiceMain>
                        <ColorSwatch $bg={s.cor} />
                        <ServiceInfo>
                          <ServiceName>{s.nome}</ServiceName>
                          {/* <ServiceSub>
                            {isNormal ? 'Padrão (fixo)' : 'Padrão (pode excluir)'}
                          </ServiceSub> */}
                        </ServiceInfo>
                      </ServiceMain>
                      <ServiceMain>
                        {!isNormal && (
                          <IconButton onPress={() => openEdit(s.id, s.nome, s.cor)}>
                            <IconSymbol name="pencil" size={20} color={t.icon} />
                          </IconButton>
                        )}
                        {!isNormal && (
                          <IconButton onPress={() => removeServico(s.id)}>
                            <IconSymbol name="trash" size={20} color={t.icon} />
                          </IconButton>
                        )}
                        {isNormal && (
                          <IconButton onPress={() => openEdit(s.id, s.nome, s.cor)}>
                            <IconSymbol name="pencil" size={20} color={t.icon} />
                          </IconButton>
                        )}
                      </ServiceMain>
                    </ServiceCard>
                    {!isNormal && (
                    <TurnoConfigBar onPress={() => openTurnoModal(s.id)}>
                      <TurnoConfigLabel>Configurar turnos</TurnoConfigLabel>
                      <TurnoConfigEditBtn>
                        <TurnoConfigEditText>Editar</TurnoConfigEditText>
                      </TurnoConfigEditBtn>
                    </TurnoConfigBar>
                    )}
                  </ServiceItem>
                );
              })}
            </List>
            <DangerButton onPress={onResetTudo} style={{ marginTop: 24, marginBottom: 8 }}>
              <DangerButtonText>Resetar tudo</DangerButtonText>
            </DangerButton>
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>

      {/* ── Configurar Escala modal ─────────────────── */}
      <Modal
        visible={showEscalaModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEscalaModal(false)}
      >
        {/* Dark overlay fills top area and closes modal on tap */}
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <TouchableWithoutFeedback onPress={() => setShowEscalaModal(false)}>
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
                  <IconButton onPress={() => setShowEscalaModal(false)}>
                    <IconSymbol name="xmark" size={20} color={t.icon} />
                  </IconButton>
                </EscalaModalHeader>

                {/* Tipo de escala */}
                <EscalaFieldLabel>Tipo de Escala</EscalaFieldLabel>
                <EscalaDropdownTrigger onPress={() => { setShowIOSPicker(false); setShowDropdown((v) => !v); }}>
                  <EscalaDropdownText>{selectedScaleLabel}</EscalaDropdownText>
                  <IconSymbol
                    name={showDropdown ? 'chevron.up' : 'chevron.down'}
                    size={16}
                    color={t.icon}
                  />
                </EscalaDropdownTrigger>

                {showDropdown && (
                  <EscalaDropdownList>
                    {SCALE_TYPES.map((opt) => (
                      <EscalaDropdownOption
                        key={opt.value}
                        $selected={escalaTipo === opt.value}
                        onPress={() => {
                          setEscalaTipo(opt.value);
                          setShowDropdown(false);
                        }}
                      >
                        <EscalaDropdownOptionText $selected={escalaTipo === opt.value}>
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
                  <EscalaDateText>{format(escalaDate, 'dd/MM/yyyy')}</EscalaDateText>
                  <IconSymbol name="calendar" size={18} color={t.icon} />
                </EscalaDatePressable>

                {/* iOS inline date picker */}
                {Platform.OS === 'ios' && showIOSPicker && (
                  <DateTimePicker
                    value={escalaDate}
                    mode="date"
                    display="spinner"
                    locale="pt-BR"
                    onChange={(_event, date) => {
                      if (date) setEscalaDate(date);
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
                <EscalaDatePressable onPress={openEscalaTimePicker}>
                  <EscalaDateText>{escalaHoraInicio}</EscalaDateText>
                  <IconSymbol name="clock" size={18} color={t.icon} />
                </EscalaDatePressable>

                {/* iOS inline time picker */}
                {Platform.OS === 'ios' && showIOSTimePicker && (
                  <DateTimePicker
                    value={horaInicioToDate(escalaHoraInicio)}
                    mode="time"
                    display="spinner"
                    locale="pt-BR"
                    is24Hour
                    onChange={(_event, date) => {
                      if (date) {
                        const hh = String(date.getHours()).padStart(2, '0');
                        const mm = String(date.getMinutes()).padStart(2, '0');
                        setEscalaHoraInicio(`${hh}:${mm}`);
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

                <EscalaSaveButton onPress={onSaveEscala}>
                  <EscalaSaveButtonText>Salvar Escala</EscalaSaveButtonText>
                </EscalaSaveButton>

                {escalaConfig && (
                  <DangerButton onPress={onRemoveEscala}>
                    <DangerButtonText>Remover Escala</DangerButtonText>
                  </DangerButton>
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
                        <Pressable
                          onPress={() =>
                            setTurnoEntries((prev) => ({
                              ...prev,
                              [h]: { ...prev[h], ativo: !prev[h]?.ativo },
                            }))
                          }
                        >
                          <SwitchTrack $on={entry.ativo}>
                            <SwitchThumb $on={entry.ativo} />
                          </SwitchTrack>
                        </Pressable>
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
                            placeholderTextColor="#555"
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
                  <TurnoModalCancelBtn onPress={() => setShowTurnoModal(false)}>
                    <TurnoModalBtnText $color={t.text}>Cancelar</TurnoModalBtnText>
                  </TurnoModalCancelBtn>
                  <TurnoModalSaveBtn onPress={saveTurnos}>
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
