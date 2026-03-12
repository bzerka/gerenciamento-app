/**
 * Formata valor em Real (BRL) no padrão brasileiro: R$ 1.234,56
 */
export function formatBRL(value?: number): string {
  if (value == null || isNaN(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
