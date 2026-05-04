import { useState, useEffect } from 'react';
import api from '../services/api';
import { Reuniao } from '../types/reuniao';

export function useReunioes() {
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [reuniaoAtiva, setReuniaoAtiva] = useState<Reuniao | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReunioes = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Reuniao[]>('/reunioes');
      const lista = Array.isArray(data) ? data : [];
      setReunioes(lista);
      if (lista.length > 0 && !reuniaoAtiva) {
        setReuniaoAtiva(lista[0]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao carregar reuniões');
    } finally {
      setLoading(false);
    }
  };

  const selecionarReuniao = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Reuniao>(`/reunioes/${id}`);
      setReuniaoAtiva(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao carregar reunião');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReunioes();
  }, []);

  return { reunioes, reuniaoAtiva, loading, error, fetchReunioes, selecionarReuniao };
}