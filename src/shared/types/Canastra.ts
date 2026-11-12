export interface CanastraScore {
  id: string;
  valor: number;
  timestamp: number;
}

export interface CanastraConfig {
  pontosFinais: number;
  pontosMaras: number;
  atalhosPontuacao: [number, number, number];
}

export interface CanastraGame {
  tempoAbertura: number;
  configPadrao: CanastraConfig;
  nomeTime1: string;
  nomeTime2: string;
  pontosTime1: CanastraScore[];
  pontosTime2: CanastraScore[];
  vencedor: 'time1' | 'time2' | null;
}

export const DEFAULT_CANASTRA_CONFIG: CanastraConfig = {
  pontosFinais: 4000,
  pontosMaras: 2000,
  atalhosPontuacao: [100, 200, -100],
};

export const createDefaultCanastraGame = (): CanastraGame => ({
  tempoAbertura: Date.now(),
  configPadrao: {
    ...DEFAULT_CANASTRA_CONFIG,
    atalhosPontuacao: [...DEFAULT_CANASTRA_CONFIG.atalhosPontuacao],
  },
  nomeTime1: 'Nós',
  nomeTime2: 'Eles',
  pontosTime1: [],
  pontosTime2: [],
  vencedor: null,
});
