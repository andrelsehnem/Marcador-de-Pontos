type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

/**
 * Envia um evento ao Google Analytics (gtag carregado no index.html).
 * Sem gtag (bloqueador de anúncios, build, app nativo), não faz nada.
 */
export const registrarEvento = (nome: string, parametros?: Record<string, string>) => {
  if (typeof window === 'undefined') {
    return;
  }

  (window as GtagWindow).gtag?.('event', nome, parametros);
};
