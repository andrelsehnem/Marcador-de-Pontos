# Implementação de AdMob no Android

## ✅ Que foi feito

1. **Instalada** a biblioteca `react-native-google-mobile-ads`
2. **Configurado** o `app.json` com Google Mobile Ads App ID
3. **Criado** componente reutilizável `AdMobBanner` em `src/shared/components/AdMob/BannerAd.tsx`
4. **Criado** serviço AdMob em `src/shared/services/admob.ts`
5. **Inicializado** o AdMob no `App.tsx`
6. **Integrado** o banner na `HomeScreen` como exemplo

## 🔑 Próximos Passos

### 1. Obter IDs do Google AdMob

1. Acesse [Google AdMob](https://admob.google.com/)
2. Crie uma conta ou faça login
3. Crie um aplicativo para Android
4. Anote:
   - **App ID**: `ca-app-pub-xxxxxxxxxxxxxxxx` (seu ID único)
   - **Banner Ad Unit ID**: `ca-app-pub-xxxx/xxxx` (para anúncios em banner)

### 2. Substituir IDs de Teste pelos Reais

#### No `app.json`:
```json
"android": {
  "googleMobileAdsAppId": "ca-app-pub-xxxxxxxxxxxxxxxx"  // Seu App ID real
},
"plugins": [
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-xxxxxxxxxxxxxxxx"  // Seu App ID real
    }
  ]
]
```

#### No `src/shared/services/admob.ts`:
```typescript
export const AD_IDS = {
  BANNER_ANDROID: 'ca-app-pub-xxxx/xxxx',  // Seu Banner Ad Unit ID
  // ... outros IDs
};
```

#### No `src/shared/components/AdMob/BannerAd.tsx`:
```typescript
unitId = Platform.select({
  android: 'ca-app-pub-xxxx/xxxx',  // Seu Banner Ad Unit ID
  ios: 'ca-app-pub-xxxx/xxxx',
}) || TestIds.BANNER,
```

### 3. Usar em Outras Telas

Para adicionar anúncios em outras telas (TrucoScreen, CachetaScreen), importe e use o componente:

```tsx
import { AdMobBanner } from '../../shared/components/AdMob/BannerAd';

// Dentro do JSX:
<View style={{ paddingVertical: 10 }}>
  <AdMobBanner />
</View>
```

## 📱 Tipos de Anúncios Disponíveis

Você pode criar novos componentes para:

- **Banner**: `BannerAdSize.ANCHORED_ADAPTIVE_BANNER` (já implementado)
- **Interstitial**: Anúncios em tela cheia
- **Rewarded**: Anúncios com recompensa

## ⚙️ Configuração do Android (build.gradle)

A biblioteca `react-native-google-mobile-ads` com Expo configura automaticamente tudo, mas se precisar build manual:

1. O plugin Expo adiciona automaticamente as dependências necessárias no `android/build.gradle`
2. Confirme em `android/app/build.gradle` que tem `com.google.android.gms:play-services-ads`

## 🏗️ Build para Produção

```bash
# Build Android
eas build --platform android

# Ou com EAS (recomendado)
eas build --platform android --profile production
```

## 🧪 Testando Localmente

Os IDs de teste já estão configurados no código. Para testar:

```bash
npm run android
```

Os anúncios de teste aparecerão normalmente sem estar ligados em conta real do AdMob.

## 📊 Monitorar Desempenho

No painel do AdMob você pode:
- Ver impressões e cliques
- Acompanhar ganhos
- Otimizar placements dos anúncios

## 🚀 Dicas de Otimização

1. **Não sobrecarregue com anúncios** - Coloque nas telas principais
2. **Use banner adaptativo** - Se adapta ao tamanho da tela
3. **Teste bem antes de publicar** - Use IDs de teste primeiro
4. **Respeite as regras do AdMob** - Não faça click fraud ou manipule anúncios
