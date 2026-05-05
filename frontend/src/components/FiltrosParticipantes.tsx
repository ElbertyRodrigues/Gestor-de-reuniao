import { FiltrosState } from '../types/reuniao';

interface Props {
  filtros: FiltrosState;
  onChange: (filtros: FiltrosState) => void;
  totalVisiveis: number;
  totalGeral: number;
}

const ToggleEngajamento = ({
  label,
  valor,
  onChange,
}: {
  label: string;
  valor: boolean | null;
  onChange: (v: boolean | null) => void;
}) => {
  const ativo = valor === true;
  return (
    <button
      type="button"
      onClick={() => onChange(ativo ? null : true)}
      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
        ativo
          ? 'bg-green-50 text-green-700 border-green-300'
          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
};

export function FiltrosParticipantes({ filtros, onChange, totalVisiveis, totalGeral }: Props) {
  const temFiltroAtivo =
    filtros.nome ||
    filtros.email ||
    filtros.camera !== null ||
    filtros.mao !== null ||
    filtros.mudo !== null;

  const limpar = () =>
    onChange({ nome: '', email: '', camera: null, mao: null, mudo: null });

  return (
    <div className="border-b border-gray-100 bg-white px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Filtros
        </span>
        {temFiltroAtivo && (
          <button
            onClick={limpar}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={filtros.nome}
          onChange={(e) => onChange({ ...filtros, nome: e.target.value })}
          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                     placeholder:text-gray-400"
        />

        <input
          type="text"
          placeholder="Buscar por e-mail..."
          value={filtros.email}
          onChange={(e) => onChange({ ...filtros, email: e.target.value })}
          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                     placeholder:text-gray-400"
        />

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Engajamento:</span>
          <ToggleEngajamento
            label="Câmera"
            valor={filtros.camera}
            onChange={(v) => onChange({ ...filtros, camera: v })}
          />
          <ToggleEngajamento
            label="Mão"
            valor={filtros.mao}
            onChange={(v) => onChange({ ...filtros, mao: v })}
          />
          <ToggleEngajamento
            label="Mudo"
            valor={filtros.mudo}
            onChange={(v) => onChange({ ...filtros, mudo: v })}
          />
        </div>
      </div>

      {temFiltroAtivo && (
        <p className="mt-2 text-xs text-gray-400">
          Exibindo{' '}
          <span className="font-medium text-gray-600">{totalVisiveis}</span> de{' '}
          <span className="font-medium text-gray-600">{totalGeral}</span> participantes
        </p>
      )}
    </div>
  );
}