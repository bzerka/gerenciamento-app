import React, { useState, useRef } from 'react';
import { FlatList, Image, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import {
  Container,
  SkipRow,
  SkipButton,
  SkipText,
  Slide,
  SlideContent,
  IconWrapper,
  Title,
  Description,
  ImageWrapper,
  SlideImage,
  Footer,
  DotsRow,
  Dot,
  Button,
  ButtonText,
} from './styled';

// Usar assets na raiz do projeto (mesma estrutura do app.json)
const CALENDARIO_IMG = require('../../../assets/images/calendario-escalas.png');
const CALENDARIO_SOURCE = Image.resolveAssetSource(CALENDARIO_IMG);

const SLIDES = [
  {
    id: '1',
    icon: 'calendar' as const,
    title: 'Agenda e Escalas',
    description:
      'Toque em dias individuais para adicionar serviços extras (até 2 por dia). Ou configure escalas na aba Serviços para preencher seus dias de trabalho normais de forma mais rápida.',
    image: true,
  },
  {
    id: '2',
    icon: 'bell' as const,
    title: 'Alertas',
    description:
      'Configure alertas para nunca perder um serviço. Você pode definir lembretes antes do início (ex: 2h antes) ou durante o turno (ex: 4h após o início).',
    image: null,
  },
  {
    id: '3',
    icon: 'doc.text' as const,
    title: 'Resumo do Mês',
    description:
      'Acompanhe suas horas trabalhadas, o valor recebido no mês e o que está pendente. Marque os pagamentos como recebidos conforme for recebendo.',
    image: null,
  },
];

export default function OnboardingScreen() {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const setHasSeenOnboarding = useOnboardingStore((s) => s.setHasSeenOnboarding);
  const imageWidth = Math.round(width * 0.7);

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

  function handleNext() {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      setHasSeenOnboarding(true);
    }
  }

  function handleSkip() {
    setHasSeenOnboarding(true);
  }

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
        renderItem={({ item }) => (
          <Slide $width={width}>
            <SlideContent>
              <IconWrapper>
                <IconSymbol name={item.icon} size={48} color={theme.buttonBackground} />
              </IconWrapper>
              <Title>{item.title}</Title>
              <Description>{item.description}</Description>
              {item.image && (
                <ImageWrapper $width={imageWidth}>
                  <SlideImage
                    source={CALENDARIO_SOURCE ?? CALENDARIO_IMG}
                    resizeMode="contain"
                  />
                </ImageWrapper>
              )}
            </SlideContent>
          </Slide>
        )}
      />

      <Footer>
        <DotsRow>
          {SLIDES.map((_, i) => (
            <Dot key={i} $active={i === currentIndex} />
          ))}
        </DotsRow>
        <Button onPress={handleNext}>
          <ButtonText>
            {currentIndex === SLIDES.length - 1 ? 'Começar' : 'Próximo'}
          </ButtonText>
          <IconSymbol
            name={currentIndex === SLIDES.length - 1 ? 'checkmark' : 'chevron.right'}
            size={20}
            color={theme.buttonText}
          />
        </Button>
      </Footer>
    </Container>
  );
}
