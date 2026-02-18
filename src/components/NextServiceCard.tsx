import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Center, InfoRow, InfoValue, Divider } from '@/src/components/styled/Screen';
import { useEventoStore } from '@/store/use-evento-store';
import { useServicoStore } from '@/store/use-servico-store';
import { format, parseISO, addHours, isAfter, isEqual, differenceInHours, differenceInMinutes, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Entypo from '@expo/vector-icons/Entypo';

const Card = styled.View`
  border-radius: 12px;
  padding: 14px;
  border-width: 1px;
  background-color: ${(p) => p.theme.tintMuted};
  border-color: ${(p) => p.theme.buttonBackground};
`;

const Badge = styled.View<{ $color?: string }>`
  align-self: flex-start;
  padding-vertical: 6px;
  padding-horizontal: 12px;
  border-radius: 18px;
  background-color: ${(p) => p.$color ?? '#ddd'};
`;

const ServiceCard = styled(Card)<{ $border?: string; $bg?: string }>`
  border-color: ${(p) => p.$border || p.theme.buttonBackground};
  background-color: ${(p) => p.$bg || p.theme.tintMuted};
  margin-bottom: 24px;
`;

const TitleText = styled.Text`
  color: ${(p) => p.theme.text};
  font-weight: 600;
  margin-bottom: 8px;
`;

const BadgeText = styled.Text<{ $color?: string }>`
  color: ${(p) => (p.$color ? (p.$color === '#fff' ? '#000' : '#000') : '#000')};
  font-weight: 700;
`;

const DateText = styled.Text`
  color: ${(p) => p.theme.icon};
`;

const RemainingText = styled.Text`
  color: ${(p) => p.theme.text};
  font-weight: 600;
`;

export function NextServiceCard() {
  const eventos = useEventoStore((s) => s.eventos);
  const servicos = useServicoStore((s) => s.servicos);
  const theme = useTheme();

  const now = new Date();
  const next = useMemo(() => {
    const upcoming = [...eventos]
      .map((ev) => {
        const start = ev.inicio ? new Date(`${ev.data}T${ev.inicio}`) : parseISO(ev.data);
        return { ...ev, start };
      })
      .filter((ev) => isAfter(ev.start, now) || isEqual(ev.start, now))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    return upcoming[0] ?? null;
  }, [eventos]);

  if (!next) return null;

  const svc = servicos.find((s) => s.id === next.servicoId);
  const primaryColor = svc?.cor ?? '#7ED957';
  // convert hex to rgba for light background
  function hexToRgb(hex: string) {
    const h = hex.replace('#', '');
    const bigint = parseInt(h.length === 3 ? h.split('').map((c)=>c+c).join('') : h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }
  const rgb = hexToRgb(primaryColor);
  const bgColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`;
  const badgeTextColor = (rgb.r*0.299 + rgb.g*0.587 + rgb.b*0.114) > 186 ? '#000' : '#FFF';
  const start = next.inicio ? new Date(`${next.data}T${next.inicio}`) : parseISO(next.data);
  const end = addHours(start, next.duracaoHoras ?? 0);
  const totalHoursLeft = differenceInHours(start, now);
  const minutesLeft = Math.max(differenceInMinutes(start, now) % 60, 0);
  const daysLeft = differenceInDays(start, now);
  const hoursRemainder = Math.max(totalHoursLeft - daysLeft * 24, 0);

  return (
    <ServiceCard $border={primaryColor} $bg={bgColor}>
      <TitleText>Próximo Serviço</TitleText>

      <Badge $color={primaryColor}>
        <BadgeText $color={badgeTextColor}>{svc?.nome ?? 'Serviço'}</BadgeText>
      </Badge>

      <View style={{ marginTop: 12 }}>
        <InfoRow>
          <IconSymbol name="calendar" size={16} color={theme.icon} />
          <DateText>{format(start, "EEEE, d 'de' MMMM", { locale: ptBR })}</DateText>
        </InfoRow>

        <InfoRow>
          <IconSymbol name="clock" size={16} color={theme.icon} />
          <DateText>{format(start, 'HH:mm')} - {format(end, 'HH:mm')} ({next.duracaoHoras}h)</DateText>
        </InfoRow>

        <InfoRow>
          <Entypo name="location-pin" size={16} color={theme.icon} />
          <DateText>{next.local ?? '-'}</DateText>
        </InfoRow>

        <Divider />

        <RemainingText>
          {totalHoursLeft > 0
            ? daysLeft > 0
              ? `Faltam ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'} ${hoursRemainder} ${hoursRemainder === 1 ? 'hora' : 'horas'}`
              : `Faltam ${hoursRemainder} ${hoursRemainder === 1 ? 'hora' : 'horas'}`
            : 'Começa em breve'}
        </RemainingText>
      </View>
    </ServiceCard>
  );
}

export default NextServiceCard;

