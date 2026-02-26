/**
 * Configuração de versão da aplicação
 * Sincronizada com package.json
 */

export const VERSAO_APP = '1.0.18';

/**
 * Obtém a versão formatada da aplicação
 * @returns String com a versão formatada (v1.0.0)
 */
export function obterVersaoFormatada(): string {
  return `v${VERSAO_APP}`;
}
