import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Hooks devem ficar sempre aqui no topo, nunca dentro de funções de clique
  const { token, logout } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ text: 'Por favor, selecione um arquivo primeiro.', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setMessage({ text: '', type: '' });

    try {
      await axios.post('/api/reunioes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        },
      });

      setMessage({ text: 'Arquivo importado com sucesso!', type: 'success' });
      setFile(null);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || error.response?.data || 'Erro ao enviar arquivo.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-green-800 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Gestão UFU - Importação</h1>
        <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition">
          Sair
        </button>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Importar Relatório de Reunião
          </h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition cursor-pointer">
              <input 
                type="file" 
                accept=".xlsx, .xls .csv"
                onChange={handleFileChange}
                className="hidden" 
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block w-full">
                <span className="text-gray-600 block">
                  {file ? file.name : "Clique para selecionar o Excel do Teams"}
                </span>
              </label>
            </div>

            {message.text && (
              <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`w-full py-3 rounded-lg font-bold text-white transition
                ${!file || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md'}
              `}
            >
              {uploading ? 'Processando...' : 'Enviar Relatório'}
            </button>
          </div>
          <p className="mt-4 text-xs text-center text-gray-500">Formatos aceitos: .xlsx, .xls</p>
        </div>
      </div>
    </div>
  );
};