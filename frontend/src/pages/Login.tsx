import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();

  const resetForm = () => {
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
    setErro('');
  };

  const alternarModo = (novoModo: 'login' | 'registro') => {
    setModo(novoModo);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }

    if (modo === 'registro') {
      if (senha.length < 6) {
        setErro('A senha deve ter no mínimo 6 caracteres');
        return;
      }
      if (senha !== confirmarSenha) {
        setErro('As senhas não coincidem');
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = modo === 'login' ? '/api/auth/login' : '/api/auth/registro';
      const response = await axios.post(endpoint, { email, senha });
      login(response.data.token);
      navigate('/');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (msg) {
        setErro(msg);
      } else if (modo === 'login') {
        setErro('E-mail ou senha incorretos');
      } else {
        setErro('Erro ao criar conta. Tente novamente');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-sm p-8">

        {/* Logo / Título */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Reuniões</h1>
          <p className="text-sm text-gray-400 mt-1">
            {modo === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
          </p>
        </div>

        {/* Abas Login / Registro */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => alternarModo('login')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
              modo === 'login'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => alternarModo('registro')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
              modo === 'registro'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Criar conta
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500
                         placeholder:text-gray-400"
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500
                         placeholder:text-gray-400"
              placeholder={modo === 'registro' ? 'Mínimo 6 caracteres' : '••••••••'}
              autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {modo === 'registro' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500
                           placeholder:text-gray-400"
                placeholder="Repita a senha"
                autoComplete="new-password"
              />
            </div>
          )}

          {/* Erro */}
          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="text-xs text-red-600">{erro}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50
                       text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            {loading
              ? 'Aguarde...'
              : modo === 'login'
              ? 'Entrar'
              : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
};