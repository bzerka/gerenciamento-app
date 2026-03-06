import React, { useState, useEffect } from 'react';
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components/native';
import { ScreenContainer, EmptyCard } from '@/src/components/styled';
import { IconSymbol } from '@/components/ui/icon-symbol';
import NextServiceCard from '@/src/components/NextServiceCard';
import { useEventoStore } from '@/store/use-evento-store';
import { useAlertaStore } from '@/store/use-alerta-store';
import { useServicoStore } from '@/store/use-servico-store';
import { useThemeOverrideStore } from '@/store/use-theme-override-store';
import { useAuth } from '@/src/contexts/AuthContext';
import { parseISO, isAfter, isEqual } from 'date-fns';
import { enviarSugestao } from '@/src/lib/sugestoes';
import { scheduleAlertaForEvents, cancelAlertaNotifications, rescheduleAllAlertas } from '@/src/utils/notifications';
import {
  Container,
  SectionTitle,
  HelpButton,
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
  PasswordInputRow,
  PasswordFieldInput,
  PasswordToggle,
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
  DeleteButtonText,
  ContaOptionCard,
  ContaOptionContent,
  ContaOptionTitle,
  ContaOptionSub,
  ContaOptionArrow,
  LogoutCard,
  LogoutContent,
  LogoutTitle,
  LogoutSub,
} from './styled';

export default function ContaScreen() {
  const t = useTheme();
  const eventos = useEventoStore((s) => s.eventos);
  const servicos = useServicoStore((s) => s.servicos);
  const { user, signOut, changePassword, error: authError, clearError } = useAuth();
  const themeOverride = useThemeOverrideStore((s) => s.themeOverride);
  const toggleTheme = useThemeOverrideStore((s) => s.toggleTheme);
  const { alertas, addAlerta, updateAlerta, removeAlerta } = useAlertaStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [quando, setQuando] = useState<'antes' | 'durante'>('antes');
  const [horas, setHoras] = useState('2');
  const [servicoIds, setServicoIds] = useState<string[]>([]);
  const [tituloError, setTituloError] = useState('');

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const [suggestionModalVisible, setSuggestionModalVisible] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  const [suggestionError, setSuggestionError] = useState('');
  const [suggestionSubmitting, setSuggestionSubmitting] = useState(false);

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

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Próximo serviço */}
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

          {/* Lembretes */}
          <AlertsHeaderRow>
            <AlertsTitle>Lembretes</AlertsTitle>
            <AddButton onPress={openNew}>
              <IconSymbol name="plus" size={24} color={t.text} />
            </AddButton>
          </AlertsHeaderRow>

          {alertas.length === 0 ? (
            <EmptyCard>
              <EmptyInner>
                <IconSymbol size={36} name="bell" color={t.icon} />
                <EmptyText style={{ marginTop: 16, fontSize: 15 }}>Nenhum lembrete criado</EmptyText>
                <EmptySubText>Toque no + para criar um</EmptySubText>
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
                      <AlertCardTitle>{timeLabel(a)}</AlertCardTitle>
                      <View onStartShouldSetResponder={() => true}>
                        <ToggleTrack
                          $on={a.ativo !== false}
                          onPress={() => onToggleAtivo(a, a.ativo === false)}
                        >
                          <ToggleThumb />
                        </ToggleTrack>
                      </View>
                    </AlertCardTopRow>
                    <AlertCardSub numberOfLines={1}>{a.titulo}, {servicosLabel(a)}</AlertCardSub>
                  </AlertCard>
                </Swipeable>
              ))}
            </AlertsList>
          )}

          {/* Conta */}
          <SectionTitle style={{ marginTop: 4 }}>Conta</SectionTitle>

          {/* <ContaOptionCard onPress={toggleTheme}>
            <IconSymbol name="circle.lefthalf.filled" size={24} color={t.icon} />
            <ContaOptionContent>
              <ContaOptionTitle>Trocar tema (teste)</ContaOptionTitle>
              <ContaOptionSub>
                {themeOverride === 'dark' ? 'Tema escuro' : themeOverride === 'light' ? 'Tema claro' : 'Seguir sistema'}
              </ContaOptionSub>
            </ContaOptionContent>
            <ContaOptionArrow>
              <IconSymbol name="chevron.right" size={20} color={t.icon} />
            </ContaOptionArrow>
          </ContaOptionCard> */}

          <ContaOptionCard
            onPress={() => {
              setPasswordModalVisible(true);
              setPasswordError('');
              setSenhaAtual('');
              setNovaSenha('');
              setConfirmarNovaSenha('');
              setShowSenhaAtual(false);
              setShowNovaSenha(false);
              setShowConfirmarSenha(false);
              clearError();
            }}
          >
            <IconSymbol name="lock" size={24} color={t.icon} />
            <ContaOptionContent>
              <ContaOptionTitle>Trocar senha</ContaOptionTitle>
              <ContaOptionSub>Altere sua senha de acesso</ContaOptionSub>
            </ContaOptionContent>
            <ContaOptionArrow>
              <IconSymbol name="chevron.right" size={20} color={t.icon} />
            </ContaOptionArrow>
          </ContaOptionCard>

          <ContaOptionCard
            onPress={() => {
              setSuggestionModalVisible(true);
              setSuggestionText('');
              setSuggestionError('');
            }}
          >
            <IconSymbol name="bubble.left" size={24} color={t.icon} />
            <ContaOptionContent>
              <ContaOptionTitle>Envie sua sugestão</ContaOptionTitle>
              <ContaOptionSub>Nos ajude a melhorar o app</ContaOptionSub>
            </ContaOptionContent>
            <ContaOptionArrow>
              <IconSymbol name="chevron.right" size={20} color={t.icon} />
            </ContaOptionArrow>
          </ContaOptionCard>

          <LogoutCard onPress={() => signOut()}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color={t.icon}/>
            <LogoutContent>
              <LogoutTitle>Sair do aplicativo</LogoutTitle>
            </LogoutContent>
          </LogoutCard>
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
                onChangeText={(v: string) => { setTitulo(v); setTituloError(''); }}
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
                  <ServicoChipText $selected={servicoIds.length === 0} numberOfLines={1}>Todos</ServicoChipText>
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
                      <ServicoChipText $selected={sel} numberOfLines={1}>{s.nome}</ServicoChipText>
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

      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'flex-end' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              if (!passwordSubmitting) setPasswordModalVisible(false);
            }}
          >
            <ModalOverlay>
              <TouchableWithoutFeedback onPress={() => {}}>
                <ModalSheet>
                  <ModalHandle />
                  <ModalTitle>Trocar senha</ModalTitle>

                  <FieldLabel>Senha atual</FieldLabel>
                  <PasswordInputRow>
                    <PasswordFieldInput
                      value={senhaAtual}
                      onChangeText={(v: string) => { setSenhaAtual(v); setPasswordError(''); clearError(); }}
                      placeholder="••••••"
                      placeholderTextColor="#6B7280"
                      secureTextEntry={!showSenhaAtual}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!passwordSubmitting}
                    />
                    <PasswordToggle onPress={() => setShowSenhaAtual((v: boolean) => !v)}>
                      <IconSymbol
                        name={showSenhaAtual ? 'eye.slash' : 'eye'}
                        size={22}
                        color={t.icon}
                      />
                    </PasswordToggle>
                  </PasswordInputRow>

                  <FieldLabel>Nova senha</FieldLabel>
                  <PasswordInputRow>
                    <PasswordFieldInput
                      value={novaSenha}
                      onChangeText={(v: string) => { setNovaSenha(v); setPasswordError(''); clearError(); }}
                      placeholder="••••••"
                      placeholderTextColor="#6B7280"
                      secureTextEntry={!showNovaSenha}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!passwordSubmitting}
                    />
                    <PasswordToggle onPress={() => setShowNovaSenha((v: boolean) => !v)}>
                      <IconSymbol
                        name={showNovaSenha ? 'eye.slash' : 'eye'}
                        size={22}
                        color={t.icon}
                      />
                    </PasswordToggle>
                  </PasswordInputRow>

                  <FieldLabel>Confirmar nova senha</FieldLabel>
                  <PasswordInputRow>
                    <PasswordFieldInput
                      value={confirmarNovaSenha}
                      onChangeText={(v: string) => { setConfirmarNovaSenha(v); setPasswordError(''); clearError(); }}
                      placeholder="••••••"
                      placeholderTextColor="#6B7280"
                      secureTextEntry={!showConfirmarSenha}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!passwordSubmitting}
                    />
                    <PasswordToggle onPress={() => setShowConfirmarSenha((v: boolean) => !v)}>
                      <IconSymbol
                        name={showConfirmarSenha ? 'eye.slash' : 'eye'}
                        size={22}
                        color={t.icon}
                      />
                    </PasswordToggle>
                  </PasswordInputRow>

                  {(passwordError || authError) ? (
                    <Text style={{ color: '#f39c12', fontSize: 12, marginBottom: 8 }}>
                      {passwordError || authError}
                    </Text>
                  ) : null}

                  <ActionsRow>
                    <CancelButton
                      onPress={() => {
                        if (!passwordSubmitting) {
                          setPasswordModalVisible(false);
                          setSenhaAtual('');
                          setNovaSenha('');
                          setConfirmarNovaSenha('');
                          setPasswordError('');
                          clearError();
                        }
                      }}
                      disabled={passwordSubmitting}
                    >
                      <CancelButtonText>Cancelar</CancelButtonText>
                    </CancelButton>
                    <ConfirmButton
                      onPress={async () => {
                        if (!senhaAtual.trim() || !novaSenha.trim() || !confirmarNovaSenha.trim()) {
                          setPasswordError('Preencha todos os campos.');
                          return;
                        }
                        if (novaSenha !== confirmarNovaSenha) {
                          setPasswordError('A nova senha e a confirmação não coincidem.');
                          return;
                        }
                        if (novaSenha.length < 6) {
                          setPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
                          return;
                        }
                        setPasswordSubmitting(true);
                        setPasswordError('');
                        clearError();
                        try {
                          await changePassword(senhaAtual, novaSenha);
                          setPasswordModalVisible(false);
                          setSenhaAtual('');
                          setNovaSenha('');
                          setConfirmarNovaSenha('');
                        } catch {
                          // error shown via authError or setPasswordError
                        } finally {
                          setPasswordSubmitting(false);
                        }
                      }}
                      disabled={passwordSubmitting}
                    >
                      {passwordSubmitting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <ConfirmButtonText>Salvar</ConfirmButtonText>
                      )}
                    </ConfirmButton>
                  </ActionsRow>
                </ModalSheet>
              </TouchableWithoutFeedback>
            </ModalOverlay>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={suggestionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSuggestionModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'flex-end' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              if (!suggestionSubmitting) setSuggestionModalVisible(false);
            }}
          >
            <ModalOverlay>
              <TouchableWithoutFeedback onPress={() => {}}>
                <ModalSheet>
                  <ModalHandle />
                  <ModalTitle>Envie sua sugestão</ModalTitle>
                  <FieldLabel>O que você gostaria de melhorar ou sugerir?</FieldLabel>
                  <FieldInput
                    value={suggestionText}
                    onChangeText={(v: string) => { setSuggestionText(v); setSuggestionError(''); }}
                    placeholder="Ex: adicionar exportar agenda, novo tipo de lembrete..."
                    placeholderTextColor={t.textSecondary}
                    multiline
                    numberOfLines={4}
                    style={{ minHeight: 100, textAlignVertical: 'top', paddingTop: 12 }}
                    editable={!suggestionSubmitting}
                  />
                  {suggestionError ? (
                    <Text style={{ color: '#f39c12', fontSize: 12, marginBottom: 8 }}>{suggestionError}</Text>
                  ) : null}
                  <ActionsRow>
                    <CancelButton
                      onPress={() => {
                        if (!suggestionSubmitting) {
                          setSuggestionModalVisible(false);
                          setSuggestionText('');
                          setSuggestionError('');
                        }
                      }}
                      disabled={suggestionSubmitting}
                    >
                      <CancelButtonText>Cancelar</CancelButtonText>
                    </CancelButton>
                    <ConfirmButton
                      onPress={async () => {
                        const text = suggestionText.trim();
                        if (!text) {
                          setSuggestionError('Escreva sua sugestão.');
                          return;
                        }
                        if (!user) {
                          setSuggestionError('Você precisa estar logado.');
                          return;
                        }
                        setSuggestionSubmitting(true);
                        setSuggestionError('');
                        try {
                          await enviarSugestao({
                            userId: user.uid,
                            userEmail: user.email ?? null,
                            text,
                          });
                          setSuggestionModalVisible(false);
                          setSuggestionText('');
                        } catch {
                          setSuggestionError('Não foi possível enviar. Tente novamente.');
                        } finally {
                          setSuggestionSubmitting(false);
                        }
                      }}
                      disabled={suggestionSubmitting}
                    >
                      {suggestionSubmitting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <ConfirmButtonText>Enviar</ConfirmButtonText>
                      )}
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
