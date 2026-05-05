import { useState } from 'react';
import api from '../services/api';
import { ParticipanteReuniao, ResumoReuniao } from '../types/reuniao';

export function useExport() {
  const [exportando, setExportando] = useState(false);

  const exportarReuniao = async (reuniaoId: number) => {
    setExportando(true);
    try {
      const response = await api.get(`/reunioes/${reuniaoId}/exportar`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename =
        response.headers['content-disposition']
          ?.split('filename=')[1]
          ?.replace(/"/g, '') ?? `reuniao_${reuniaoId}.xlsx`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setExportando(false);
    }
  };

  const exportarCSVLocal = (
      resumo: any,
      participantes: any[]
    ) => {
      const isVotacao = participantes.some((p) => p.voto);
      const sep = ';';

      const limpar = (val: any): string => {
        if (val === null || val === undefined || val === 'null') return '';
        return String(val).replace(/"/g, '""');
      };

      const simNao = (val: any): string => {
        if (val === true) return 'Sim';
        return '';
      };

      const cabecalho = isVotacao
        ? ['ID', 'Start time', 'Completion time', 'Email', 'Nome', 'Voto'].join(sep)
        : ['Nome', 'Email', 'UPN', 'Função', 'Entrada', 'Saída', 'Duração', 'Câmera', 'Levantou Mão', 'Desativou Mudo'].join(sep);

      const linhas = participantes.map((p, index) => {
        if (isVotacao) {
          return [
            index + 1,
            `"${limpar(p.primeiraEntrada)}"`,
            `"${limpar(p.ultimaSaida)}"`,
            `"${limpar(p.email)}"`,
            `"${limpar(p.nome)}"`,
            `"${limpar(p.voto)}"`,
          ].join(sep);
        }
        return [
          `"${limpar(p.nome)}"`,
          `"${limpar(p.email)}"`,
          `"${limpar(p.upn)}"`,
          `"${limpar(p.funcao)}"`,
          `"${limpar(p.primeiraEntrada)}"`,
          `"${limpar(p.ultimaSaida)}"`,
          `"${limpar(p.duracaoParticipacao)}"`,
          simNao(p.cameraLigada),
          simNao(p.levantarMaos),
          simNao(p.desativarMudo),
        ].join(sep);
      });

      const conteudo = [cabecalho, ...linhas].join('\n');

      const bom = '\uFEFF';
      const blob = new Blob([bom + conteudo], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${limpar(resumo.titulo).replace(/[^a-z0-9]/gi, '_')}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    };

  return { exportando, exportarReuniao, exportarCSVLocal };
}