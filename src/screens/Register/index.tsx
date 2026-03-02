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
  BatalhaoList,
  FieldError,
  BatalhaoOption,
  BatalhaoOptionText,
  BatalhaoTrigger,
  BatalhaoTriggerText,
} from './styled';

const BATALHOES = [
  '1º Batalhão',
  '2º Batalhão',
  '3º Batalhão',
  '4º Batalhão',
  '5º Batalhão',
  'Outro',
];

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { signUp, error, clearError } = useAuth();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [batalhao, setBatalhao] = useState('');
  const [posto, setPosto] = useState('');
  const [showBatalhaoPicker, setShowBatalhaoPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    clearError();
  }, [clearError]);

  function formatCpf(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!nome.trim()) {
      errors.nome = 'Informe seu nome completo.';
    } else if (!cpf.trim()) {
      errors.cpf = 'Informe seu CPF.';
    } else if (cpf.replace(/\D/g, '').length !== 11) {
      errors.cpf = 'CPF deve ter 11 dígitos.';
    } else if (!batalhao.trim()) {
      errors.batalhao = 'Selecione seu batalhão.';
    } else if (!posto.trim()) {
      errors.posto = 'Informe seu posto ou graduação.';
    } else if (!email.trim()) {
      errors.email = 'Informe seu email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Informe um email válido.';
    } else if (!password.trim()) {
      errors.password = 'Informe sua senha.';
    } else if (password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres.';
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
      await signUp(email.trim(), password, {
        nome: nome.trim(),
        cpf: cpf.replace(/\D/g, ''),
        batalhao: batalhao.trim(),
        posto: posto.trim() || undefined,
      });
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
            <AuthTitle>Criar conta</AuthTitle>
            <AuthSubtitle>
              Preencha seus dados para se cadastrar. O batalhão será usado para trocas de escala entre colegas.
            </AuthSubtitle>
          </AuthHeader>

          <AuthForm>
            <AuthInput
              placeholder="Nome completo"
              placeholderTextColor="#9CA3AF"
              value={nome}
              onChangeText={(t) => {
                setNome(t);
                clearFieldError('nome');
              }}
              autoCapitalize="words"
              editable={!submitting}
              $error={!!fieldErrors.nome}
            />
            {fieldErrors.nome && <FieldError>{fieldErrors.nome}</FieldError>}

            <AuthInput
              placeholder="CPF"
              placeholderTextColor="#9CA3AF"
              value={cpf}
              onChangeText={(t) => {
                setCpf(formatCpf(t));
                clearFieldError('cpf');
              }}
              keyboardType="numeric"
              maxLength={14}
              editable={!submitting}
              $error={!!fieldErrors.cpf}
            />
            {fieldErrors.cpf && <FieldError>{fieldErrors.cpf}</FieldError>}

            <BatalhaoTrigger
              onPress={() => setShowBatalhaoPicker((v) => !v)}
              disabled={submitting}
              $error={!!fieldErrors.batalhao}
            >
              <BatalhaoTriggerText $placeholder={!batalhao}>
                {batalhao || 'Batalhão / Unidade'}
              </BatalhaoTriggerText>
              <IconSymbol
                name={showBatalhaoPicker ? 'chevron.up' : 'chevron.down'}
                size={18}
                color="#9CA3AF"
              />
            </BatalhaoTrigger>
            {fieldErrors.batalhao && <FieldError>{fieldErrors.batalhao}</FieldError>}
            {showBatalhaoPicker && (
              <BatalhaoList>
                {BATALHOES.map((b) => (
                  <BatalhaoOption
                    key={b}
                    $selected={batalhao === b}
                    onPress={() => {
                      setBatalhao(b);
                      setShowBatalhaoPicker(false);
                      clearFieldError('batalhao');
                    }}
                  >
                    <BatalhaoOptionText $selected={batalhao === b}>{b}</BatalhaoOptionText>
                  </BatalhaoOption>
                ))}
              </BatalhaoList>
            )}

            <AuthInput
              placeholder="Posto / Graduação"
              placeholderTextColor="#9CA3AF"
              value={posto}
              onChangeText={(t) => {
                setPosto(t);
                clearFieldError('posto');
              }}
              editable={!submitting}
              $error={!!fieldErrors.posto}
            />
            {fieldErrors.posto && <FieldError>{fieldErrors.posto}</FieldError>}

            <AuthInput
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                clearFieldError('email');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!submitting}
              $error={!!fieldErrors.email}
            />
            {fieldErrors.email && <FieldError>{fieldErrors.email}</FieldError>}

            <AuthInput
              placeholder="Senha (mín. 6 caracteres)"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                clearFieldError('password');
              }}
              secureTextEntry
              autoComplete="new-password"
              editable={!submitting}
              $error={!!fieldErrors.password}
            />
            {fieldErrors.password && <FieldError>{fieldErrors.password}</FieldError>}

            {error && <AuthError>{error}</AuthError>}

            <AuthButton onPress={handleRegister} disabled={submitting}>
              <AuthButtonText>{submitting ? 'Cadastrando...' : 'Cadastrar'}</AuthButtonText>
            </AuthButton>
          </AuthForm>

          <AuthLink onPress={() => router.back()}>
            <AuthLinkText>Já tem conta? Entrar</AuthLinkText>
          </AuthLink>
        </AuthScroll>
      </KeyboardAvoidingView>
    </AuthContainer>
  );
}
