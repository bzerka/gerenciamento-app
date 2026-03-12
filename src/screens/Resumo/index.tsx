import { IconSymbol } from '@/components/ui/icon-symbol';
import { ScreenContainer } from '@/src/components/styled';
import { formatBRL } from '@/src/utils/currency';
import { useEventoStore } from '@/store/use-evento-store';
import { useServicoStore } from '@/store/use-servico-store';
import { addHours, addMonths, format, parseISO, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { useTheme } from 'styled-components/native';
import {
  Badge,
  BadgeText,
  BadgeWrapper,
  Card,
  CardText,
  CardTitle,
  Container,
  Divider,
  EscalaCard,
  EscalaCardMain,
  EscalaHeaderRow,
  LegendColor,
  List,
  MetaText,
  MetaWrapper,
  MonthNavButton,
  MonthSelectorRow,
  MonthTitle,
  PaymentStatusContainer,
  ProgressInner,
  ProgressOuter,
  SmallTextRight,
  StatLabelRow,
  StatRow,
  StatValue,
  StatValueRow,
  TypeCount,
  TypeItem,
  TypeLabel,
  TypesRow,
} from './styled';

export default function ResumoScreen() {
  const eventos = useEventoStore((s) => s.eventos);
  const servicos = useServicoStore((s) => s.servicos);
  const t = useTheme();

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const month = selectedDate.toISOString().slice(0, 7); // yyyy-mm

  const goPrevMonth = () => setSelectedDate((d) => subMonths(d, 1));
  const goNextMonth = () => setSelectedDate((d) => addMonths(d, 1));
  const isNormalServico = (id?: string) =>
    servicos.find((s) => s.id === id)?.nome.toLowerCase() === 'normal';

  const monthEvents = eventos.filter((e) => e.data.startsWith(month));
  const billedEvents = monthEvents.filter((e) => !isNormalServico(e.servicoId));

  const hojeStr = format(new Date(), 'yyyy-MM-dd');

  const totalHoras = billedEvents.reduce((acc, e) => acc + (e.duracaoHoras ?? 0), 0);
  const totalValor = billedEvents.reduce((acc, e) => acc + (e.valor ?? 0), 0);
  // Realizado = eventos que já passaram (data < hoje) → já entraram na conta
  const realizado = billedEvents
    .filter((e) => e.data < hojeStr)
    .reduce((acc, e) => acc + (e.valor ?? 0), 0);
  // Pendente = hoje e futuros (data >= hoje) → ainda não entraram na conta
  const pendenteValor = billedEvents
    .filter((e) => e.data >= hojeStr)
    .reduce((acc, e) => acc + (e.valor ?? 0), 0);
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

  function isEventoRealizado(ev: { data: string; inicio?: string; duracaoHoras?: number }) {
    const [y, m, d] = ev.data.split('-').map(Number);
    const [hh, mm] = (ev.inicio ?? '00:00').split(':').map(Number);
    const inicioEv = new Date(y, m - 1, d, hh, mm ?? 0, 0, 0);
    const fimEv = addHours(inicioEv, ev.duracaoHoras ?? 0);
    return fimEv < new Date();
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
              <StatValueRow>
                <StatValue $overLimit={totalHoras > 120}>{totalHoras.toFixed(1)}h</StatValue>
                <StatValue> / 120h</StatValue>
              </StatValueRow>
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
                  <CardText>Realizado</CardText>
                </StatLabelRow>
                <Text style={{ color: '#2EB866' }}>{formatBRL(realizado)}</Text>
              </StatRow>
              <StatRow>
                <StatLabelRow>
                  <LegendColor $color="#F39C12" />
                  <CardText>Pendente</CardText>
                </StatLabelRow>
                <Text style={{ color: '#F39C12' }}>{formatBRL(pendenteValor)}</Text>
              </StatRow>
              <StatRow style={{ marginTop: 12 }}>
                <StatLabelRow>
                <LegendColor $color={t.text} />
                  <CardText>Total</CardText>
                </StatLabelRow>
                <Text style={{ color: t.text }}>{formatBRL(realizado + pendenteValor)}</Text>
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
                const realizado = isEventoRealizado(ev);
                return (
                  <EscalaCard key={ev.id}>
                    <EscalaCardMain>
                      <EscalaHeaderRow>
                        <CardText>{format(parseISO(ev.data), "d 'de' MMMM", { locale: ptBR })}</CardText>
                        <Text style={{ color: realizado ? '#2EB866' : '#F39C12', fontSize: 16, fontWeight: '600' }}>
                          {formatBRL(ev.valor ?? 0)}
                        </Text>
                      </EscalaHeaderRow>

                      <BadgeWrapper>
                        <Badge $bg={s?.cor}>
                          <BadgeText>{s?.nome} · {ev.duracaoHoras}h</BadgeText>
                        </Badge>
                      </BadgeWrapper>

                      <MetaWrapper>
                        <MetaText>{formatRange(ev.inicio, ev.duracaoHoras)} {ev.notas ? `· ${ev.notas}` : ''}</MetaText>
                      </MetaWrapper>
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

