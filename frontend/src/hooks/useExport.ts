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
    resumo: ResumoReuniao,
    participantes: ParticipanteReuniao[]
  ) => {
    const cabecalho = [
      'Nome', 'Email', 'UPN', 'Função',
      'Entrada', 'Saída', 'Duração',
      'Câmera', 'Levantou Mão', 'Desativou Mudo',
    ].join(',');

    const linhas = participantes.map((p) =>
      [
        `"${p.nome}"`,
        `"${p.email}"`,
        `"${p.upn}"`,
        `"${p.funcao}"`,
        p.entrada,
        p.saida,
        p.duracao,
        p.cameraLigada ? 'Sim' : 'Não',
        p.levantarMaos ? 'Sim' : 'Não',
        p.desativarMudo ? 'Sim' : 'Não',
      ].join(',')
    );

    const metadados = [
      `"Reunião:","${resumo.titulo}"`,
      `"Início:","${resumo.horaInicio}"`,
      `"Término:","${resumo.horaTermino}"`,
      `"Duração:","${resumo.duracao}"`,
      `"Tempo médio:","${resumo.tempoMedio}"`,
      `"Participantes atendidos:","${resumo.participantesAtendidos}"`,
      '',
      cabecalho,
      ...linhas,
    ].join('\n');

    const bom = '\uFEFF';
    const blob = new Blob([bom + metadados], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumo.titulo.replace(/[^a-z0-9]/gi, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return { exportando, exportarReuniao, exportarCSVLocal };
}