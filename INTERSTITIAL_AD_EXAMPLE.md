# Exemplo: Usando Interstitial Ad no TrucoScreen

Para mostrar um anúncio em tela cheia entre rodadas/partidas no TrucoScreen, use o hook `useInterstitialAd`:

## Implementação Básica

```tsx
import React, { useEffect, useState } from 'react';
// ... outros imports
import { useInterstitialAd } from '../../shared/components/AdMob/useInterstitialAd';

interface TrucoScreenProps {
  onBack: () => void;
}

const TrucoScreen: React.FC<TrucoScreenProps> = ({ onBack }) => {
  // ... seu código existente
  
  // Inicializar o hook de Interstitial Ad
  const { showInterstitialAd } = useInterstitialAd();

  // Exemplo: mostrar anúncio quando uma rodada termina
  const handleRodadaFim = async () => {
    // Sua lógica para fim de rodada
    
    // Mostrar anúncio de vez em quando (a cada 3 rodadas, por exemplo)
    if (roundCount % 3 === 0) {
      await showInterstitialAd();
    }
  };

  // Exemplo: mostrar anúncio quando usuário volta ao menu
  const handleBackWithAd = async () => {
    await showInterstitialAd();
    onBack();
  };

  return (
    // ... seu JSX
  );
};
```

## Boas Práticas

✅ **FAÇA:**
- Mostre anúncios entre ações naturais (fim de partida, entre rodadas)
- Use refetch automático para ter anúncio pronto quando precisar
- Respeite o tempo do usuário - não mostre muito frequentemente

❌ **NÃO FAÇA:**
- Não mostre muitos anúncios seguidos
- Não alagueue o usuário com publicidade
- Não force cliques em anúncios (contra as políticas do AdMob)

## Sugestões de Colocação de Ads

No seu app de jogo de baralho, bons lugares são:

| Local | Tipo | Frequência |
|-------|------|-----------|
| HomeScreen | Banner | Sempre visível |
| Entre rodadas (Truco/Cacheta) | Interstitial | A cada 3-5 rodadas |
| Fim de partida | Interstitial | 1 vez por partida |
| Rodapé de telas | Banner | Sempre visível |

## Componentes Disponíveis

1. **BannerAd** - Anúncio em banner (já implementado no HomeScreen)
2. **useInterstitialAd** - Hook para anúncios em tela cheia
3. **useRewardedAd** - (Opcional) Anúncios com recompensa ao usuário

Você pode adaptar esses componentes conforme suas necessidades!
