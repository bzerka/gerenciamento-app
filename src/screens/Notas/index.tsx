import React, { useState } from 'react';
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components/native';
import { ScreenContainer } from '@/src/components/styled';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useNotaStore } from '@/store/use-nota-store';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import {
  Container,
  HeaderRow,
  HeaderTitle,
  AddButton,
  EmptyWrapper,
  EmptyIconCircle,
  EmptyTitle,
  EmptySub,
  NotesList,
  NotaCard,
  NotaCardHeader,
  NotaTitulo,
  NotaDate,
  NotaPreview,
  ModalOverlay,
  ModalSheet,
  ModalTitle,
  ModalHeaderRow,
  ModalTitleInHeader,
  ModalCloseButton,
  FieldLabel,
  TituloInput,
  ConteudoInput,
  ActionsRow,
  DeleteButton,
  DeleteButtonText,
  SaveButton,
  SaveButtonText,
  SwipeDeleteAction,
} from './styled';

const PREVIEW_LENGTH = 80;

function truncate(str: string, len: number) {
  if (!str?.trim()) return '';
  const t = str.trim();
  return t.length <= len ? t : t.slice(0, len) + '...';
}

export default function NotasScreen() {
  const t = useTheme();
  const { notas, addNota, updateNota, removeNota } = useNotaStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');

  function openNew() {
    setEditingId(null);
    setTitulo('');
    setConteudo('');
    setModalVisible(true);
  }

  function openEdit(nota: { id: string; titulo: string; conteudo: string }) {
    setEditingId(nota.id);
    setTitulo(nota.titulo);
    setConteudo(nota.conteudo);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setEditingId(null);
  }

  function onSave() {
    const tit = titulo.trim() || 'Sem título';
    const cont = conteudo.trim() || '';

    if (editingId) {
      updateNota(editingId, { titulo: tit, conteudo: cont });
    } else {
      addNota({ titulo: tit, conteudo: cont });
    }
    closeModal();
  }

  function onDelete() {
    if (editingId) {
      removeNota(editingId);
      closeModal();
    }
  }

  const sortedNotas = [...notas].sort(
    (a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
  );

  return (
    <ScreenContainer>
      <Container>
        <HeaderRow>
          <HeaderTitle>Notas</HeaderTitle>
          <AddButton onPress={openNew}>
            <IconSymbol name="plus" size={24} color={t.text} />
          </AddButton>
        </HeaderRow>

        {notas.length === 0 ? (
          <EmptyWrapper>
            <EmptyIconCircle>
              <IconSymbol name="note.text" size={40} color={t.icon} />
            </EmptyIconCircle>
            <EmptyTitle>Nenhuma nota ainda</EmptyTitle>
            <EmptySub>
              Toque no botão + para criar sua primeira anotação.{'\n'}
              Use para lembretes, ideias ou tarefas pendentes.
            </EmptySub>
          </EmptyWrapper>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}>
            <NotesList>
              {sortedNotas.map((n) => (
                <Swipeable
                  key={n.id}
                  renderRightActions={() => (
                    <SwipeDeleteAction onPress={() => removeNota(n.id)}>
                      <IconSymbol name="trash" size={24} color="#FFF" />
                    </SwipeDeleteAction>
                  )}
                  overshootRight={false}>
                  <NotaCard onPress={() => openEdit(n)}>
                    <NotaCardHeader>
                      <NotaTitulo numberOfLines={1}>
                        {n.titulo || 'Sem título'}
                      </NotaTitulo>
                      <NotaDate>
                        {format(parseISO(n.createdAt), "d MMM", { locale: ptBR })}
                      </NotaDate>
                    </NotaCardHeader>
                    {n.conteudo ? (
                      <NotaPreview numberOfLines={2}>
                        {truncate(n.conteudo, PREVIEW_LENGTH)}
                      </NotaPreview>
                    ) : null}
                  </NotaCard>
                </Swipeable>
              ))}
            </NotesList>
          </ScrollView>
        )}
      </Container>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <ModalOverlay>
              <TouchableWithoutFeedback onPress={() => {}}>
                <ModalSheet>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24 }}>
                    <ModalHeaderRow>
                      <ModalTitleInHeader>
                        {editingId ? 'Editar nota' : 'Nova nota'}
                      </ModalTitleInHeader>
                      <ModalCloseButton onPress={closeModal}>
                        <IconSymbol name="xmark" size={22} color={t.icon} />
                      </ModalCloseButton>
                    </ModalHeaderRow>

                    <FieldLabel>Título</FieldLabel>
                    <TituloInput
                      value={titulo}
                      onChangeText={setTitulo}
                      placeholder="Ex: Lembrar de..."
                      placeholderTextColor={t.textSecondary}
                      returnKeyType="next"
                    />

                    <FieldLabel>Conteúdo</FieldLabel>
                    <ConteudoInput
                      value={conteudo}
                      onChangeText={setConteudo}
                      placeholder="Escreva sua anotação aqui..."
                      placeholderTextColor={t.textSecondary}
                      multiline
                      returnKeyType="default"
                    />

                    <ActionsRow>
                      {editingId ? (
                        <>
                          <DeleteButton onPress={onDelete}>
                            <DeleteButtonText>Excluir</DeleteButtonText>
                          </DeleteButton>
                          <SaveButton onPress={onSave}>
                            <SaveButtonText>Salvar</SaveButtonText>
                          </SaveButton>
                        </>
                      ) : (
                        <SaveButton onPress={onSave} style={{ flex: 1 }}>
                          <SaveButtonText>Salvar</SaveButtonText>
                        </SaveButton>
                      )}
                    </ActionsRow>
                  </ScrollView>
                </ModalSheet>
              </TouchableWithoutFeedback>
            </ModalOverlay>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenContainer>
  );
}
