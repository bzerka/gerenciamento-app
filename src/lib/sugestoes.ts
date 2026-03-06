import { db } from '@/src/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const COL = 'sugestoes';

export interface SugestaoPayload {
  userId: string;
  userEmail: string | null;
  text: string;
}

/**
 * Salva uma sugestão do usuário na coleção Firestore `sugestoes`.
 * Cada documento tem: userId, userEmail, text, createdAt.
 */
export async function enviarSugestao(payload: SugestaoPayload): Promise<void> {
  await addDoc(collection(db, COL), {
    userId: payload.userId,
    userEmail: payload.userEmail ?? null,
    text: payload.text.trim(),
    createdAt: serverTimestamp(),
  });
}
