import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/src/contexts/AuthContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import {
  AuthButton,
  AuthButtonText,
  AuthContainer,
  AuthError,
  AuthForm,
  AuthHeader,
  AuthInput,
  AuthLink,
  AuthLinkText,
  AuthScroll,
  AuthSubtitle,
  AuthTitle,
  AuthTopBar,
  BackButton,
} from './styled';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { signIn, error, clearError } = useAuth();
  const [email, setEmail] = useState('igortest@hotmail.com');
  const [password, setPassword] = useState('123456');
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
      router.replace('/(tabs)');
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
          <AuthTopBar>
            <BackButton onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={28} color={theme.text} />
            </BackButton>
          </AuthTopBar>
          <AuthHeader>
            <AuthTitle>Entrar</AuthTitle>
            <AuthSubtitle>
              Use seu email e senha para acessar sua conta e gerenciar seus serviços.
            </AuthSubtitle>
          </AuthHeader>

          <AuthForm>
            <AuthInput
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!submitting}
            />

            <AuthInput
              placeholder="Senha"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              editable={!submitting}
            />

            {error && <AuthError>{error}</AuthError>}

            <AuthButton onPress={handleLogin} disabled={submitting}>
              <AuthButtonText>{submitting ? 'Entrando...' : 'Entrar'}</AuthButtonText>
            </AuthButton>
          </AuthForm>

          <AuthLink onPress={() => router.push('/(auth)/register')}>
            <AuthLinkText>Não tem conta? Cadastre-se</AuthLinkText>
          </AuthLink>
        </AuthScroll>
      </KeyboardAvoidingView>
    </AuthContainer>
  );
}
