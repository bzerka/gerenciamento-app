import React from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import { ScreenContainer, EmptyCard } from '@/src/components/styled';
import { IconSymbol } from '@/components/ui/icon-symbol';
import NextServiceCard from '@/src/components/NextServiceCard';
import { useEventoStore } from '@/store/use-evento-store';
import { parseISO, isAfter, isEqual } from 'date-fns';
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
} from './styled';

export default function AlertasScreen() {
  const t = useTheme();
  const eventos = useEventoStore((s) => s.eventos);

  return (
    <ScreenContainer>
      <Container>
        <HeaderRow>
          <HeaderTitle>Alertas</HeaderTitle>
        </HeaderRow>

        <ScrollView style={{ marginTop: 12 }}>
          <NextServiceCard />

          {(() => {
            const now = new Date();
            const upcoming = eventos
              .map((ev) => ({ ...ev, start: ev.inicio ? new Date(`${ev.data}T${ev.inicio}`) : parseISO(ev.data) }))
              .filter((ev) => isAfter(ev.start, now) || isEqual(ev.start, now));
            if (upcoming.length === 0) {
              return (
                <EmptyCard>
                  <EmptyInner>
                    <IconSymbol size={42} name="calendar" color={t.icon} />
                    <EmptyText>Nenhum serviço agendado</EmptyText>
                    <EmptySubText>Adicione serviços na aba Agenda</EmptySubText>
                  </EmptyInner>
                </EmptyCard>
              );
            }
            return null;
          })()}

          <AlertsHeaderRow>
            <AlertsTitle>Meus Alertas</AlertsTitle>
            <AddButton>
              <AddButtonText>+ Adicionar</AddButtonText>
            </AddButton>
          </AlertsHeaderRow>

          <EmptyCard>
            <EmptyInner>
              <IconSymbol size={36} name="bell" color={t.icon} />
              <EmptyText style={{ marginTop: 16, fontSize: 15 }}>Nenhum alerta criado</EmptyText>
              <EmptySubText>Crie alertas para ser avisado antes ou durante os serviços</EmptySubText>
            </EmptyInner>
          </EmptyCard>
        </ScrollView>
      </Container>
    </ScreenContainer>
  );
}

