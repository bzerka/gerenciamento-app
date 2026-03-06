import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/src/contexts/AuthContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AuthButton,
  AuthButtonText,
  AuthContainer,
  AuthError,
  AuthForm,
  AuthInput,
  AuthLink,
  AuthLinkHighlight,
  AuthLinkText,
  AuthLinkWrapper,
  AuthScroll,
  BrandSubtitle,
  BrandTitle,
  BrandingWrapper,
  FormCard,
  FormHeader,
  FormSubtitle,
  FormTitle,
  InputGroup,
  InputLabel,
  InputWrapper,
  LogoBox,
  PasswordToggle,
} from './styled';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, error, clearError } = useAuth();
  const [email, setEmail] = useState('igortest@hotmail.com');
  const [password, setPassword] = useState('1234567');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);
    clearError();
    try {
      await signIn(email.trim(), password);
      // AuthGate re-renderá com user/session e mostrará onboarding ou (tabs)
    } catch {
      // error is set in context
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthContainer $paddingTop={insets.top} $paddingBottom={insets.bottom}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AuthScroll>
          <BrandingWrapper>
            <LogoBox>
              <IconSymbol name="bag" size={36} color="#FFFFFF" />
            </LogoBox>
            <BrandTitle>Escala Pro</BrandTitle>
            <BrandSubtitle>Gerencie seus dias de trabalho</BrandSubtitle>
          </BrandingWrapper>

          <FormCard>
            <FormHeader>
              <FormTitle>Entrar</FormTitle>
              <FormSubtitle>Acesse sua conta para continuar</FormSubtitle>
            </FormHeader>

            <AuthForm>
              <InputGroup>
                <InputLabel>E-mail</InputLabel>
                <InputWrapper>
                  <AuthInput
                    placeholder="seu@email.com"
                    placeholderTextColor="#6B7280"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    editable={!submitting}
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <InputLabel>Senha</InputLabel>
                <InputWrapper>
                  <AuthInput
                    placeholder="••••••••••"
                    placeholderTextColor="#6B7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    editable={!submitting}
                  />
                  <PasswordToggle onPress={() => setShowPassword((v) => !v)}>
                    <IconSymbol
                      name={showPassword ? 'eye.slash' : 'eye'}
                      size={22}
                      color="#9CA3AF"
                    />
                  </PasswordToggle>
                </InputWrapper>
              </InputGroup>

              {error && <AuthError>{error}</AuthError>}

              <AuthButton onPress={handleLogin} disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <AuthButtonText>Entrar</AuthButtonText>
                )}
              </AuthButton>
            </AuthForm>
          </FormCard>

          <AuthLinkWrapper>
            <AuthLinkText>Não tem uma conta?</AuthLinkText>
            <AuthLink onPress={() => router.push('/(auth)/register')}>
              <AuthLinkHighlight>Cadastre-se</AuthLinkHighlight>
            </AuthLink>
          </AuthLinkWrapper>
        </AuthScroll>
      </KeyboardAvoidingView>
    </AuthContainer>
  );
}
