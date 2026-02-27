import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ScreenContainer } from '@/src/components/styled';
import { useTheme } from 'styled-components/native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useEventoStore } from '@/store/use-evento-store';
import { useServicoStore } from '@/store/use-servico-store';
import { format, parseISO, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import {
  Container,
  Card,
  CardText,
  CardTitle,
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
  SmallTextRight,
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
  MonthSelectorRow,
  MonthNavButton,
  MonthTitle,
  PaymentToggle,
  PaymentCircle,
  PaymentInfo,
  PaymentTitle,
  PaymentSubTitle,
} from './styled';

export default function ResumoScreen() {
  const eventos = useEventoStore((s) => s.eventos);
  const servicos = useServicoStore((s) => s.servicos);
  const updateEvento = useEventoStore((s) => s.updateEvento);
  const t = useTheme();

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const month = selectedDate.toISOString().slice(0, 7); // yyyy-mm

  const goPrevMonth = () => setSelectedDate((d) => subMonths(d, 1));
  const goNextMonth = () => setSelectedDate((d) => addMonths(d, 1));
  const isNormalServico = (id?: string) =>
    servicos.find((s) => s.id === id)?.nome.toLowerCase() === 'normal';

  const monthEvents = eventos.filter((e) => e.data.startsWith(month));
  const billedEvents = monthEvents.filter((e) => !isNormalServico(e.servicoId));

  const totalHoras = billedEvents.reduce((acc, e) => acc + (e.duracaoHoras ?? 0), 0);
  const totalValor = billedEvents.reduce((acc, e) => acc + (e.valor ?? 0), 0);
  const recebido = billedEvents.reduce((acc, e) => acc + ((e.pago ? e.valor ?? 0 : 0)), 0);
  const pendente = totalValor - recebido;
  const targetValor = 4500;
  const tiposComContagem = servicos
    .filter((s) => s.nome.toLowerCase() !== 'normal')
    .map((s) => ({ ...s, count: billedEvents.filter((e) => e.servicoId === s.id).length }))
    .filter((s) => s.count > 0);

  function formatRange(inicio?: string, dur?: number) {
    if (!inicio) return '';
    const [hh, mm] = inicio.split(':').map((v) => Number(v));
    const endH = ((hh || 0) + (dur || 0)) % 24;
    return `${inicio} - ${String(endH).padStart(2, '0')}:${String(mm || 0).padStart(2, '0')}`;
  }

  // Mostrar os serviços do mês do mais recente para o mais antigo.
  const displayedEvents = billedEvents
    .slice()
    .sort((a, b) => {
      const da = parseISO(a.data).getTime();
      const db = parseISO(b.data).getTime();
      if (db !== da) return db - da; // data mais recente primeiro
      // Se mesma data, ordenar pelo horário de início (mais recente primeiro)
      const ia = a.inicio ?? '00:00';
      const ib = b.inicio ?? '00:00';
      return ib.localeCompare(ia);
    });

  return (
    <ScreenContainer>
      <Container>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}>
          <MonthSelectorRow>
            <MonthNavButton onPress={goPrevMonth}>
              <IconSymbol name="chevron.left" size={24} color={t.icon} />
            </MonthNavButton>
            <MonthTitle>{format(selectedDate, 'MMMM yyyy', { locale: ptBR })}</MonthTitle>
            <MonthNavButton onPress={goNextMonth}>
              <IconSymbol name="chevron.right" size={24} color={t.icon} />
            </MonthNavButton>
          </MonthSelectorRow>

          <Card>
            <CardTitle>Resumo do Mês</CardTitle>

            <StatRow>
              <StatLabelRow>
                <IconSymbol name="clock" size={18} color={t.icon} />
                <CardText>Horas Trabalhadas</CardText>
              </StatLabelRow>
              <StatValue>{totalHoras.toFixed(1)}h / 120h</StatValue>
            </StatRow>

            <ProgressOuter>
              <ProgressInner $widthPercent={Math.min((totalHoras / 120) * 100, 100)} />
            </ProgressOuter>
            <SmallTextRight>{Math.max(120 - totalHoras, 0).toFixed(1)}h restantes</SmallTextRight>

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

            {tiposComContagem.length > 0 && (
              <CardText $marginBottom={12}>Serviços por Tipo</CardText>
            )}
            <TypesRow>
              {tiposComContagem.length > 0 && (
                tiposComContagem.slice(0, 4).map((s) => (
                  <TypeItem key={s.id}>
                    <TypeCount $color={s.cor}>{s.count}</TypeCount>
                    <TypeLabel>{s.nome}</TypeLabel>
                  </TypeItem>
                ))
              )}
            </TypesRow>
          </Card>

          <CardText $marginBottom={12}>Serviços ({billedEvents.length})</CardText>

          <List>
            {displayedEvents.length === 0 ? (
              <Card>
                <CardText>Nenhum serviço registrado neste mês.</CardText>
              </Card>
            ) : (
              displayedEvents.map((ev) => {
                const s = servicos.find((x) => x.id === ev.servicoId);
                return (
                  <EscalaCard key={ev.id}>
                    <EscalaCardMain>
                      <EscalaHeaderRow>
                        <CardText>{format(parseISO(ev.data), "d 'de' MMMM", { locale: ptBR })}</CardText>
                        <CardText>R$ {((ev.valor ?? 0)).toFixed(2)}</CardText>
                      </EscalaHeaderRow>

                      <BadgeWrapper>
                        <Badge $bg={s?.cor}>
                          <BadgeText>{s?.nome} · {ev.duracaoHoras}h</BadgeText>
                        </Badge>
                      </BadgeWrapper>

                      <MetaWrapper>
                        <MetaText>{formatRange(ev.inicio, ev.duracaoHoras)} {ev.notas ? `· ${ev.notas}` : ''}</MetaText>
                      </MetaWrapper>

                      <ToggleWrapper>
                        <PaymentToggle onPress={() => updateEvento(ev.id, { pago: !ev.pago })} $pago={!!ev.pago}>
                        <PaymentCircle $checked={!!ev.pago}>
                          {ev.pago ? (
                            <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>
                              ✓
                            </Text>
                          ) : null}
                        </PaymentCircle>
                          <PaymentInfo>
                            <PaymentTitle>{ev.pago ? 'Pago' : 'Pagamento Pendente'}</PaymentTitle>
                            <PaymentSubTitle>
                              {ev.pago ? 'Toque para marcar como pendente' : 'Toque para marcar como pago'}
                            </PaymentSubTitle>
                          </PaymentInfo>
                        </PaymentToggle>
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

