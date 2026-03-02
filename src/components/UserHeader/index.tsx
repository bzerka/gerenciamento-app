import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as S from './styled';

export function UserHeader() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { userProfile, signOut } = useAuth();

  const displayName = userProfile?.nome?.toUpperCase() ?? 'USUÁRIO';
  const posto = userProfile?.posto?.toUpperCase() ?? '';

  return (
    <S.Header $paddingTop={insets.top}>
      <S.UserInfo>
        <S.Avatar>
          <IconSymbol name="person.fill" size={28} color={theme.icon} />
        </S.Avatar>
        <S.UserText>
          <S.UserName>{displayName}</S.UserName>
          {posto ? <S.UserSubtitle>{posto}</S.UserSubtitle> : null}
        </S.UserText>
      </S.UserInfo>
      <S.LogoutButton onPress={signOut}>
        <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color={theme.text} />
      </S.LogoutButton>
    </S.Header>
  );
}
