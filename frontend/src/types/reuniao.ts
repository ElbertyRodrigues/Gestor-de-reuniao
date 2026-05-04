export interface ResumoReuniao {
  titulo: string;
  participantesAtendidos: number;
  horaInicio: string;
  horaTermino: string;
  duracao: string;
  tempoMedio: string;
}

export interface ParticipanteReuniao {
  id: number;
  nome: string;
  email: string;
  upn: string;
  funcao: string;
  entrada: string;
  saida: string;
  duracao: string;
  cameraLigada: boolean;
  levantarMaos: boolean;
  desativarMudo: boolean;
}

export interface Reuniao {
  id: number;
  resumo: ResumoReuniao;
  participantes: ParticipanteReuniao[];
}

export interface FiltrosState {
  nome: string;
  email: string;
  camera: boolean | null;
  mao: boolean | null;
  mudo: boolean | null;
}