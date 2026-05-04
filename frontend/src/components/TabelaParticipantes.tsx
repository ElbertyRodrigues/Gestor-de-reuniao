import React, { useState, useMemo, useEffect } from 'react';
import { FiltrosState } from '../types/reuniao';

interface Participante {
  id: number;
  nome: string;
  email: string;
  upn?: string;
  funcao?: string;
  primeiraEntrada?: string;
  ultimaSaida?: string;
  duracaoParticipacao?: string;
  cameraLigada?: boolean | null;
  levantarMaos?: boolean | null;
  desativarMudo?: boolean | null;
  voto?: string | null;
}

interface Props {
  participantes: Participante[];
  filtros: FiltrosState;
  onFiltroChange: (total: number) => void;
}

const Icone = ({ ativo, title }: { ativo: boolean | null | undefined; title: string }) => {
  if (ativo === null || ativo === undefined) {
    return (
      <span title={title}
        className="inline-flex items-center justify-center w-6 h-6 rounded text-xs bg-gray-100 text-gray-300">
        –
      </span>
    );
  }
  return (
    <span title={title}
      className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium
        ${ativo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-400'}`}>
      {ativo ? '✓' : '✗'}
    </span>
  );
};

const BadgeVoto = ({ voto }: { voto: string }) => {
  const cores: Record<string, string> = {
    'Favorável': 'bg-green-50 text-green-700 border-green-200',
    'Abstenção': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Contrário': 'bg-red-50 text-red-600 border-red-200',
  };
  const classe = cores[voto] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span className={`inline-block px-2 py-0.5 text-xs rounded border font-medium ${classe}`}>
      {voto}
    </span>
  );
};

type Coluna = keyof Participante;

export function TabelaParticipantes({ participantes, filtros, onFiltroChange }: Props) {
  const [ordenacao, setOrdenacao] = useState<{ col: Coluna; dir: 'asc' | 'desc' }>({
    col: 'nome',
    dir: 'asc',
  });


  const isVotacao = participantes.some((p) => p.voto);

  const filtrados = useMemo(() => {
    const nomeLower = filtros.nome.toLowerCase();
    const emailLower = filtros.email.toLowerCase();

    const resultado = participantes.filter((p) => {
      if (nomeLower && !p.nome?.toLowerCase().includes(nomeLower)) return false;
      if (emailLower && !p.email?.toLowerCase().includes(emailLower)) return false;
      if (filtros.camera !== null && p.cameraLigada !== filtros.camera) return false;
      if (filtros.mao !== null && p.levantarMaos !== filtros.mao) return false;
      if (filtros.mudo !== null && p.desativarMudo !== filtros.mudo) return false;
      return true;
    });

    return resultado.sort((a, b) => {
      const va = String(a[ordenacao.col] ?? '');
      const vb = String(b[ordenacao.col] ?? '');
      return ordenacao.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [participantes, filtros, ordenacao]);

  useEffect(() => {
    onFiltroChange(filtrados.length);
  }, [filtrados.length]);

  const ordenarPor = (col: Coluna) => {
    setOrdenacao((prev) =>
      prev.col === col ? { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' }
    );
  };

  const Th = ({ col, label, className = '' }: { col: Coluna; label: string; className?: string }) => (
    <th
      onClick={() => ordenarPor(col)}
      className={`px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase
                  tracking-wide cursor-pointer hover:text-gray-600 select-none whitespace-nowrap ${className}`}
    >
      {label}
      {ordenacao.col === col && (
        <span className="ml-1">{ordenacao.dir === 'asc' ? '↑' : '↓'}</span>
      )}
    </th>
  );

  if (filtrados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="text-sm">Nenhum participante encontrado</p>
        <p className="text-xs mt-1">Tente ajustar os filtros</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr className="border-b border-gray-200">
            <Th col="nome" label="Nome" className="w-1/5" />
            <Th col="email" label="E-mail" className="w-1/5" />
            <Th col="funcao" label="Função" />
            {isVotacao ? (
              <>
                <Th col="primeiraEntrada" label="Horário do voto" />
                <Th col="voto" label="Voto" />
              </>
            ) : (
              <>
                <Th col="primeiraEntrada" label="Entrada" />
                <Th col="ultimaSaida" label="Saída" />
                <Th col="duracaoParticipacao" label="Duração" />
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">
                  Câm / Mão / Mudo
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filtrados.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2.5 font-medium text-gray-800 max-w-[180px] truncate">
                {p.nome}
              </td>
              <td className="px-3 py-2.5 text-gray-500 max-w-[180px] truncate">{p.email || '—'}</td>
              <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">
                {p.funcao || 'Participante'}
              </td>

              {isVotacao ? (
                <>
                  <td className="px-3 py-2.5 text-gray-500 tabular-nums whitespace-nowrap">
                    {p.primeiraEntrada || '—'}
                  </td>
                  <td className="px-3 py-2.5">
                    {p.voto ? <BadgeVoto voto={p.voto} /> : <span className="text-gray-300">—</span>}
                  </td>
                </>
              ) : (
                <>
                  <td className="px-3 py-2.5 text-gray-500 tabular-nums whitespace-nowrap">
                    {p.primeiraEntrada || '—'}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500 tabular-nums whitespace-nowrap">
                    {p.ultimaSaida || '—'}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500 tabular-nums whitespace-nowrap">
                    {p.duracaoParticipacao || '—'}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <Icone ativo={p.cameraLigada} title="Câmera ligada" />
                      <Icone ativo={p.levantarMaos} title="Levantou a mão" />
                      <Icone ativo={p.desativarMudo} title="Desativou mudo" />
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
