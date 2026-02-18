import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ScreenContainer } from '@/src/components/styled';
import { useEventoStore } from '@/store/use-evento-store';
import { useServicoStore } from '@/store/use-servico-store';
import { format, parseISO } from 'date-fns';
import {
  Container,
  Title,
  Card,
  CardText,
  List,
  EscalaCard,
  EscalaCardMain,
  MetaText,
  Divider,
  LegendItem,
  LegendColor,
  Badge,
  BadgeText,
  SmallText,
  ToggleButton,
  ToggleCircle,
  ToggleText,
  StatRow,
  StatLabelRow,
  StatValue,
  ProgressOuter,
  ProgressInner,
  TypesRow,
  TypeItem,
  TypeCount,
  TypeLabel,
  EscalaHeaderRow,
  BadgeWrapper,
  MetaWrapper,
  ToggleWrapper,
  ToggleCircleInner,
  PaymentStatusContainer,
} from './styled';

export default function ResumoScreen() {
  const eventos = useEventoStore((s) => s.eventos);
  const servicos = useServicoStore((s) => s.servicos);
  const updateEvento = useEventoStore((s) => s.updateEvento);

  const month = new Date().toISOString().slice(0, 7); // yyyy-mm
  const monthEvents = eventos.filter((e) => e.data.startsWith(month));

  const totalHoras = monthEvents.reduce((acc, e) => acc + (e.duracaoHoras ?? 0), 0);
  const totalValor = monthEvents.reduce((acc, e) => acc + (e.valor ?? 0), 0);
  const recebido = monthEvents.reduce((acc, e) => acc + ((e.pago ? e.valor ?? 0 : 0)), 0);
  const pendente = totalValor - recebido;
  const tiposComContagem = servicos
    .map((s) => ({ ...s, count: monthEvents.filter((e) => e.servicoId === s.id).length }))
    .filter((s) => s.count > 0);

  function formatRange(inicio?: string, dur?: number) {
    if (!inicio) return '';
    const [hh, mm] = inicio.split(':').map((v) => Number(v));
    const endH = ((hh || 0) + (dur || 0)) % 24;
    return `${inicio} - ${String(endH).padStart(2, '0')}:${String(mm || 0).padStart(2, '0')}`;
  }

  return (
    <ScreenContainer>
      <Container>
        <Title>{format(new Date(), 'MMMM yyyy')}</Title>

        <Card>
          <CardText>Resumo do Mês</CardText>

          <StatRow>
            <StatLabelRow>
              <Text>⏱️</Text>
              <CardText>Horas Trabalhadas</CardText>
            </StatLabelRow>
            <StatValue>{totalHoras.toFixed(1)}h / 120h</StatValue>
          </StatRow>

          <ProgressOuter>
            <ProgressInner $widthPercent={Math.min((totalHoras / 120) * 100, 100)} />
          </ProgressOuter>
          <SmallText>{Math.max(120 - totalHoras, 0).toFixed(1)}h restantes</SmallText>

          <Divider />

          <PaymentStatusContainer>
            <StatRow>
              <StatLabelRow>
                <LegendColor $color="#2EB866" />
                <CardText>Recebido</CardText>
              </StatLabelRow>
              <Text style={{ color: '#2EB866' }}>R$ {recebido.toFixed(2)}</Text>
            </StatRow>
            <StatRow>
              <StatLabelRow>
                <LegendColor $color="#F39C12" />
                <CardText>Pendente</CardText>
              </StatLabelRow>
              <Text style={{ color: '#F39C12' }}>R$ {pendente.toFixed(2)}</Text>
            </StatRow>
          </PaymentStatusContainer>
          <Divider />

          <CardText>Serviços por Tipo</CardText>
          <TypesRow>
            {tiposComContagem.length === 0 ? (
              <CardText>Nenhum serviço neste mês</CardText>
            ) : (
              tiposComContagem.slice(0, 4).map((s) => (
                <TypeItem key={s.id}>
                  <TypeCount $color={s.cor}>{s.count}</TypeCount>
                  <TypeLabel>{s.nome}</TypeLabel>
                </TypeItem>
              ))
            )}
          </TypesRow>
        </Card>

        <CardText>Serviços ({monthEvents.length})</CardText>

        <ScrollView>
          <List>
            {monthEvents.length === 0 ? (
              <Card>
                <CardText>Nenhum serviço neste mês.</CardText>
              </Card>
            ) : (
              monthEvents.map((ev) => {
                const s = servicos.find((x) => x.id === ev.servicoId);
                return (
                  <EscalaCard key={ev.id}>
                    <EscalaCardMain>
                      <EscalaHeaderRow>
                        <CardText>{format(parseISO(ev.data), "d 'de' MMMM")}</CardText>
                        <CardText>R$ {((ev.valor ?? 0)).toFixed(2)}</CardText>
                      </EscalaHeaderRow>

                      <BadgeWrapper>
                        <Badge $bg={s?.cor}>
                          <BadgeText>{s?.nome} · {ev.duracaoHoras}h</BadgeText>
                        </Badge>
                      </BadgeWrapper>

                      <MetaWrapper>
                        <MetaText>{formatRange(ev.inicio, ev.duracaoHoras)} · {ev.notas ?? ''}</MetaText>
                      </MetaWrapper>

                      <ToggleWrapper>
                        <ToggleButton onPress={() => updateEvento(ev.id, { pago: !ev.pago })} $active={!!ev.pago} $activeColor="#2EB866">
                          <ToggleCircle $checked={!!ev.pago}>
                            {ev.pago ? <ToggleCircleInner /> : null}
                          </ToggleCircle>
                          <ToggleText $active={!!ev.pago}>{ev.pago ? 'Pago' : 'Marcar como pago'}</ToggleText>
                        </ToggleButton>
                      </ToggleWrapper>
                    </EscalaCardMain>
                  </EscalaCard>
                );
              })
            )}
          </List>
        </ScrollView>
      </Container>
    </ScreenContainer>
  );
}

