import styled from 'styled-components/native';

// ── Onboarding ──────────────────────────────────────────────────────────

export const Container = styled.View<{ $paddingTop?: number; $paddingBottom?: number }>`
  flex: 1;
  background-color: ${(p) => p.theme.background};
  padding-top: ${(p) => p.$paddingTop ?? 0}px;
  padding-bottom: ${(p) => p.$paddingBottom ?? 0}px;
`;

export const SkipRow = styled.View`
  position: absolute;
  top: 56px;
  right: 20px;
  z-index: 10;
`;

export const SkipButton = styled.Pressable`
  padding: 8px;
`;

export const SkipText = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 16px;
`;

export const Slide = styled.View<{ $width: number }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: 24px;
  width: ${(p) => p.$width}px;
`;

export const SlideContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  max-width: 360px;
`;

export const IconWrapper = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${(p) => p.theme.tintMuted};
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

export const Title = styled.Text`
  color: ${(p) => p.theme.text};
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
`;

export const Description = styled.Text`
  color: ${(p) => p.theme.textSecondary};
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  margin-bottom: 24px;
`;

export const ImageWrapper = styled.View<{ $width: number }>`
  width: ${(p) => p.$width}px;
  margin-top: 8px;
  border-radius: 12px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${(p) => p.theme.border};
  align-items: center;
  justify-content: center;
  align-self: center;
`;

export const SlideImage = styled.Image`
  width: 100%;
  background-color: transparent;
`;

export const Footer = styled.View`
  padding-horizontal: 24px;
  padding-bottom: 32px;
  gap: 24px;
`;

export const DotsRow = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 8px;
`;

export const Dot = styled.View<{ $active?: boolean }>`
  width: ${(p) => (p.$active ? 24 : 8)}px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(p) => (p.$active ? p.theme.buttonBackground : p.theme.iconMuted)};
`;

export const Button = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${(p) => p.theme.buttonBackground};
  padding-vertical: 16px;
  border-radius: 12px;
`;

export const ButtonText = styled.Text`
  color: ${(p) => p.theme.buttonText};
  font-size: 17px;
  font-weight: 700;
`;
