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

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { signUp, error, clearError } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    clearError();
  }, [clearError]);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!nome.trim()) {
      errors.nome = 'Informe seu nome completo.';
    }
    if (!email.trim()) {
      errors.email = 'Informe seu email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Informe um email válido.';
    }
    if (!password.trim()) {
      errors.password = 'Informe sua senha.';
    } else if (password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleRegister() {
    if (!validate()) return;
    setSubmitting(true);
    setFieldErrors({});
    clearError();
    try {
      await signUp(email.trim(), password, { nome: nome.trim() });
      // AuthGate re-renderará com user/session e mostrará onboarding ou (tabs)
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
            <BrandSubtitle>Crie sua conta gratuitamente</BrandSubtitle>
          </BrandingWrapper>

          <FormCard>
            <FormHeader>
              <FormTitle>Cadastro</FormTitle>
              <FormSubtitle>Preencha os dados para criar sua conta</FormSubtitle>
            </FormHeader>

            <AuthForm>
              <InputGroup>
                <InputLabel>Nome</InputLabel>
                <InputWrapper>
                  <AuthInput
                    placeholder="Seu nome completo"
                    placeholderTextColor="#6B7280"
                    value={nome}
                    onChangeText={(t) => {
                      setNome(t);
                      clearFieldError('nome');
                    }}
                    autoCapitalize="words"
                    editable={!submitting}
                  />
                </InputWrapper>
              </InputGroup>
              {fieldErrors.nome && <AuthError>{fieldErrors.nome}</AuthError>}

              <InputGroup>
                <InputLabel>E-mail</InputLabel>
                <InputWrapper>
                  <AuthInput
                    placeholder="seu@email.com"
                    placeholderTextColor="#6B7280"
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      clearFieldError('email');
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    editable={!submitting}
                  />
                </InputWrapper>
              </InputGroup>
              {fieldErrors.email && <AuthError>{fieldErrors.email}</AuthError>}

              <InputGroup>
                <InputLabel>Senha</InputLabel>
                <InputWrapper>
                  <AuthInput
                    placeholder="••••••"
                    placeholderTextColor="#6B7280"
                    value={password}
                    onChangeText={(t) => {
                      setPassword(t);
                      clearFieldError('password');
                      clearFieldError('confirmPassword');
                    }}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
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
              {fieldErrors.password && <AuthError>{fieldErrors.password}</AuthError>}

              <InputGroup>
                <InputLabel>Confirmar senha</InputLabel>
                <InputWrapper>
                  <AuthInput
                    placeholder="••••••"
                    placeholderTextColor="#6B7280"
                    value={confirmPassword}
                    onChangeText={(t) => {
                      setConfirmPassword(t);
                      clearFieldError('confirmPassword');
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="new-password"
                    editable={!submitting}
                  />
                  <PasswordToggle onPress={() => setShowConfirmPassword((v) => !v)}>
                    <IconSymbol
                      name={showConfirmPassword ? 'eye.slash' : 'eye'}
                      size={22}
                      color="#9CA3AF"
                    />
                  </PasswordToggle>
                </InputWrapper>
              </InputGroup>
              {fieldErrors.confirmPassword && <AuthError>{fieldErrors.confirmPassword}</AuthError>}

              {error && <AuthError>{error}</AuthError>}

              <AuthButton onPress={handleRegister} disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <AuthButtonText>Criar conta</AuthButtonText>
                )}
              </AuthButton>
            </AuthForm>
          </FormCard>

          <AuthLinkWrapper>
            <AuthLinkText>Já tem uma conta?</AuthLinkText>
            <AuthLink onPress={() => router.back()}>
              <AuthLinkHighlight>Entrar</AuthLinkHighlight>
            </AuthLink>
          </AuthLinkWrapper>
        </AuthScroll>
      </KeyboardAvoidingView>
    </AuthContainer>
  );
}
