import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSchedule } from '@/hooks/use-escala';
import { WEEK_DAYS } from '@/src/utils/escala';
import { useSession } from '@/src/contexts/SessionContext';
import { useScheduleStore } from '@/store/use-escala-store';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import {
  EscalaDatePressable,
  EscalaDateText,
  EscalaDayButton,
  EscalaDayButtonText,
  EscalaDayRow,
  EscalaDropdownList,
  EscalaDropdownOption,
  EscalaDropdownOptionText,
  EscalaDropdownText,
  EscalaDropdownTrigger,
  EscalaFieldLabel,
} from '../Servicos/styled';
import {
  Button,
  ButtonText,
  Container,
  Description,
  Dot,
  DotsRow,
  EscalaFormWrapper,
  EscalaSlideContent,
  Footer,
  IconWrapper,
  ImageWrapper,
  SecondaryButton,
  SecondaryButtonText,
  SkipButton,
  SkipRow,
  SkipText,
  Slide,
  SlideContent,
  SlideImage,
  Title,
} from './styled';

// Usar assets na raiz do projeto (mesma estrutura do app.json)
const CALENDARIO_IMG = require('../../../assets/images/calendario-escalas.png');

const SLIDES = [
  {
    id: '1',
    type: 'intro' as const,
    icon: 'calendar' as const,
    title: 'Agenda e Escalas',
    description:
      'Toque em dias individuais para adicionar serviços extras (até 2 por dia). Ou configure escalas na aba Serviços para preencher seus dias de trabalho normais de forma mais rápida.',
    image: true,
  },
  {
    id: '2',
    type: 'escala' as const,
  },
  {
    id: '3',
    type: 'intro' as const,
    icon: 'bell' as const,
    title: 'Lembretes',
    description:
      'Configure lembretes programados para nunca perder um serviço. Você recebe notificações antes do início (ex: 12h antes) ou durante o turno (ex: 2h após o início).',
    image: null,
  },
  {
    id: '4',
    type: 'intro' as const,
    icon: 'doc.text' as const,
    title: 'Resumo do Mês',
    description:
      'Acompanhe suas horas trabalhadas, o valor recebido no mês e o que está pendente. Marque os pagamentos como recebidos conforme for recebendo.',
    image: null,
  },
];

const ESCALA_SLIDE_INDEX = 1;

export default function OnboardingScreen() {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { setHasSeenOnboarding } = useSession();
  const imageWidth = Math.round(width * 0.7);

  const { setConfig: setScheduleConfig } = useScheduleStore();
  const { workSchedule, getScheduleDef, applySchedule } = useSchedule();

  // Schedule form state
  const [scheduleTipo, setScheduleTipo] = useState('12x36');
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [scheduleHoraInicio, setScheduleHoraInicio] = useState('07:00');
  const [diaFolhaExtra, setDiaFolhaExtra] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showIOSDatePicker, setShowIOSDatePicker] = useState(false);
  const [showIOSTimePicker, setShowIOSTimePicker] = useState(false);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      if (viewableItems[0]?.index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  function horaInicioToDate(s: string): Date {
    const [hh, mm] = s.split(':').map(Number);
    const d = new Date();
    d.setHours(isNaN(hh) ? 7 : hh, isNaN(mm) ? 0 : mm, 0, 0);
    return d;
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
      setShowIOSDatePicker((v) => !v);
    }
  }

  function openTimePicker() {
    setShowDropdown(false);
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

    goToNext();
  }

  function goToNext() {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      setHasSeenOnboarding(true);
    }
  }

  function handleNext() {
    if (currentIndex === ESCALA_SLIDE_INDEX) {
      goToNext();
    } else if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      setHasSeenOnboarding(true);
    }
  }

  function handleSkip() {
    setHasSeenOnboarding(true);
  }

  function handleConfigurarDepois() {
    goToNext();
  }

  const selectedScheduleLabel =
    workSchedule.find((s) => s.value === scheduleTipo)?.label ?? '';
  const isScheduleSlide = currentIndex === ESCALA_SLIDE_INDEX;

  return (
    <Container $paddingTop={insets.top} $paddingBottom={insets.bottom}>
      <SkipRow>
        <SkipButton onPress={handleSkip} hitSlop={16}>
          <SkipText>Pular</SkipText>
        </SkipButton>
      </SkipRow>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.type === 'escala') {
            return (
              <Slide $width={width}>
                <KeyboardAvoidingView
                  style={{ flex: 1, width: '100%' }}
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                  <EscalaSlideContent
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      flexGrow: 1,
                      paddingHorizontal: 24,
                      paddingTop: 24,
                      paddingBottom: 16,
                    }}
                  >
                    <IconWrapper>
                      <IconSymbol name="calendar" size={48} color={theme.buttonBackground} />
                    </IconWrapper>
                    <Title>Configure sua Escala</Title>
                    <Description>
                      Defina seu tipo de escala e data de início para preencher automaticamente os dias de trabalho na agenda.
                    </Description>

                    <EscalaFormWrapper>
                      <EscalaFieldLabel>Tipo de Escala</EscalaFieldLabel>
                      <EscalaDropdownTrigger
                        onPress={() => {
                          setShowIOSDatePicker(false);
                          setShowIOSTimePicker(false);
                          setShowDropdown((v) => !v);
                        }}
                      >
                        <EscalaDropdownText>{selectedScheduleLabel}</EscalaDropdownText>
                        <IconSymbol
                          name={showDropdown ? 'chevron.up' : 'chevron.down'}
                          size={16}
                          color={theme.icon}
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

                      <EscalaFieldLabel style={{ marginTop: 14 }}>
                        Data de Início (primeiro dia de trabalho)
                      </EscalaFieldLabel>
                      <EscalaDatePressable onPress={openDatePicker}>
                        <EscalaDateText>{format(scheduleDate, 'dd/MM/yyyy')}</EscalaDateText>
                        <IconSymbol name="calendar" size={18} color={theme.icon} />
                      </EscalaDatePressable>

                      {Platform.OS === 'ios' && showIOSDatePicker && (
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
                          textColor={theme.text}
                          accentColor={theme.text}
                        />
                      )}

                      <EscalaFieldLabel style={{ marginTop: 14 }}>
                        Hora de Início
                      </EscalaFieldLabel>
                      <EscalaDatePressable onPress={openTimePicker}>
                        <EscalaDateText>{scheduleHoraInicio}</EscalaDateText>
                        <IconSymbol name="clock" size={18} color={theme.icon} />
                      </EscalaDatePressable>

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
                          textColor={theme.text}
                          accentColor={theme.text}
                        />
                      )}

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
                    </EscalaFormWrapper>
                  </EscalaSlideContent>
                </KeyboardAvoidingView>
              </Slide>
            );
          }

          const introItem = item as Extract<(typeof SLIDES)[number], { type: 'intro' }>;
          return (
            <Slide $width={width}>
              <SlideContent>
                <IconWrapper>
                  <IconSymbol name={introItem.icon} size={48} color={theme.buttonBackground} />
                </IconWrapper>
                <Title>{introItem.title}</Title>
                <Description>{introItem.description}</Description>
                {introItem.image && (
                  <ImageWrapper $width={imageWidth}>
                    <SlideImage
                      source={CALENDARIO_IMG}
                      resizeMode="contain"
                    />
                  </ImageWrapper>
                )}
              </SlideContent>
            </Slide>
          );
        }}
      />

      <Footer>
        <DotsRow>
          {SLIDES.map((_, i) => (
            <Dot key={i} $active={i === currentIndex} />
          ))}
        </DotsRow>

        {isScheduleSlide ? (
          <>
            <SecondaryButton onPress={handleConfigurarDepois}>
              <SecondaryButtonText>Configurar depois</SecondaryButtonText>
            </SecondaryButton>
            <Button onPress={onSaveSchedule}>
              <ButtonText>Salvar e Continuar</ButtonText>
            </Button>
          </>
        ) : (
          <Button onPress={handleNext}>
            <ButtonText>
              {currentIndex === SLIDES.length - 1 ? 'Começar' : 'Próximo'}
            </ButtonText>
          </Button>
        )}
      </Footer>
    </Container>
  );
}
