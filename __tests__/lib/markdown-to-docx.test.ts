import { markdownToDocx } from '@/lib/markdown-to-docx';

describe('markdown-to-docx - Funções de Exportação', () => {
  describe('Funções devem estar definidas', () => {
    it('deve exportar markdownToDocx como função', () => {
      expect(typeof markdownToDocx).toBe('function');
    });
  });
});
