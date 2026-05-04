import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiltrosState } from '../types/reuniao';
import { FiltrosParticipantes } from '../components/FiltrosParticipantes';
import { TabelaParticipantes } from '../components/TabelaParticipantes';
import { useExport } from '../hooks/useExport';

export const Dashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [reunioes, setReunioes] = useState<any[]>([]);
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosState>({
    nome: '', email: '', camera: null, mao: null, mudo: null,
  });
  const [totalFiltrado, setTotalFiltrado] = useState(0);

  const { token, logout } = useAuth();
  const { exportando, exportarCSVLocal } = useExport();

  const carregarReunioes = async () => {
    try {
      const response = await axios.get('/api/reunioes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReunioes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao carregar lista', error);
    }
  };

  useEffect(() => {
    if (token) carregarReunioes();
  }, [token]);

  const selecionarReuniao = async (id: number) => {
    setLoading(true);
    setFiltros({ nome: '', email: '', camera: null, mao: null, mudo: null });
    try {
      const response = await axios.get(`/api/reunioes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReuniaoSelecionada(response.data);
    } catch (error) {
      console.error('Erro ao carregar detalhes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('/api/reunioes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setFile(null);
      carregarReunioes();
      alert('Arquivo importado com sucesso!');
    } catch (error) {
      alert('Erro no upload');
    }
  };

  const resumo = reuniaoSelecionada
    ? {
        titulo: reuniaoSelecionada.titulo,
        horaInicio: reuniaoSelecionada.startTime,
        horaTermino: reuniaoSelecionada.endTime,
        duracao: reuniaoSelecionada.duracao,
        tempoMedio: reuniaoSelecionada.tempoMedioParticipacao,
        participantesAtendidos:
          reuniaoSelecionada.participantesAtendidos ??
          reuniaoSelecionada.participantes?.length ??
          0,
      }
    : null;

  const participantes: any[] = Array.isArray(reuniaoSelecionada?.participantes)
    ? reuniaoSelecionada.participantes
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      <nav className="bg-green-900 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Gestão UFU - Analisador de Reuniões</h1>
        <button onClick={logout} className="bg-red-600 px-4 py-2 rounded text-sm">
          Sair
        </button>
      </nav>

      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">

        
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded shadow border-t-4 border-green-600">
            <h2 className="font-bold mb-3 text-sm">Importar Novo Relatório</h2>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files![0])}
              className="text-xs w-full mb-2"
            />
            <button
              onClick={handleUpload}
              className="w-full bg-green-700 text-white py-2 rounded text-sm font-bold"
            >
              Subir Excel
            </button>
          </div>

          <div className="bg-white rounded shadow max-h-[600px] overflow-y-auto">
            <h2 className="p-3 bg-gray-100 font-bold text-gray-700 border-b text-sm">
              Arquivos no Banco
            </h2>
            <ul>
              {reunioes.map((r) => (
                <li
                  key={r.id}
                  onClick={() => selecionarReuniao(r.id)}
                  className={`p-3 border-b cursor-pointer hover:bg-green-50 transition ${
                    reuniaoSelecionada?.id === r.id ? 'bg-green-100' : ''
                  }`}
                >
                  <p className="font-bold text-green-800 text-sm truncate">
                    {r.titulo || 'Sem Título'}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {r.dataCriacao || r.startTime}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        
        <div className="md:col-span-3">
          {loading && (
            <div className="bg-white p-10 rounded shadow text-center text-gray-400 text-sm">
              Carregando...
            </div>
          )}

          {!loading && reuniaoSelecionada && resumo && (
            <div className="flex flex-col gap-0 rounded shadow overflow-hidden border border-gray-100">

              
              <div className="flex items-start justify-between px-4 py-3 bg-white border-b border-gray-100">
                <div>
                  <h2 className="text-sm font-bold text-gray-800">{resumo.titulo}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {resumo.horaInicio} – {resumo.horaTermino}
                    {resumo.tempoMedio ? ` · tempo médio: ${resumo.tempoMedio}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => exportarCSVLocal(resumo, participantes)}
                  disabled={exportando}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border
                             bg-green-50 text-green-700 border-green-200 hover:bg-green-100
                             disabled:opacity-50 transition-colors"
                >
                  {exportando ? 'Exportando...' : '⬇ Exportar CSV'}
                </button>
              </div>

              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-white border-b border-gray-100">
                {[
                  { label: 'Participantes', valor: resumo.participantesAtendidos },
                  { label: 'Com câmera', valor: participantes.filter((p) => p.cameraLigada).length },
                  { label: 'Levantaram mão', valor: participantes.filter((p) => p.levantarMaos).length },
                  { label: 'Desativaram mudo', valor: participantes.filter((p) => p.desativarMudo).length },
                ].map(({ label, valor }, i) => (
                  <div
                    key={label}
                    className={`px-4 py-3 bg-gray-50 ${i < 3 ? 'border-r border-gray-100' : ''}`}
                  >
                    <p className="text-[10px] uppercase text-gray-400 font-medium">{label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-0.5">{valor}</p>
                  </div>
                ))}
              </div>

              
              <FiltrosParticipantes
                filtros={filtros}
                onChange={(novosFiltros) => {
                  setFiltros(novosFiltros);
                }}
                totalVisiveis={totalFiltrado}
                totalGeral={participantes.length}
              />

              
              <div className="overflow-auto max-h-[55vh] bg-white">
                <TabelaParticipantes
                  participantes={participantes}
                  filtros={filtros}
                  onFiltroChange={setTotalFiltrado}
                />
              </div>
            </div>
          )}

          {!loading && !reuniaoSelecionada && (
            <div className="bg-white p-20 rounded shadow text-center text-gray-400">
              <p>Selecione um arquivo na lateral para ver o resumo e os detalhes dos participantes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
