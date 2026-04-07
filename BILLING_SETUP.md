# Configuração de Faturamento (Play Billing) - Remover Anúncios

Este documento explica como configurar completamente o fluxo de compra de "Remover Anúncios" no seu app Android.

## Passo 1: Criar Produto Único no Play Console

1. Acesse [Google Play Console](https://play.google.com/console)
2. Selecione seu app (dev.andre100.marcadorPontos)
3. Vá para **Monetização** > **Produtos Únicos**
4. Clique em **Criar Produto**
5. Configure:
   - **ID do Produto**: `remove_ads` (ou use outro ID que preferir)
   - **Título**: Remover Anúncios
   - **Descrição**: Remove anúncios de banner do app
   - **Preço**: Defina o preço desejado (ex: R$ 4,99)
6. Salve o produto

## Passo 2: Atualizar ID do Produto no Código

Abra o arquivo `src/shared/services/billing.ts` e atualize:

```typescript
export const PRODUCT_ID = 'remove_ads'; // Substitua pelo ID do seu produto
```

## Passo 3: Implementação Completa da Billing Library (Avançado)

Atualmente, o código está configurado de forma simplificada. Para integração completa com a Play Billing Library v6.0.1+:

### Instalação:
```bash
npm install @react-native-firebase/app @react-native-firebase/remote-config
# ou use uma biblioteca específica de Billing
```

### Implementação do Fluxo de Compra

No arquivo `src/shared/services/billing.ts`, adicione:

```typescript
import { BillingClient, BillingFlowParams } from 'your-billing-library';

let billingClient: BillingClient | null = null;

export const initializeBilling = async () => {
  if (!isBillingSupportedRuntime()) return;
  
  billingClient = BillingClient.newBuilder()
    .setListener(handlePurchaseUpdate)
    .enablePendingPurchases()
    .build();
    
  await billingClient.startConnection();
};

const handlePurchaseUpdate = (billingResult: BillingResult, purchases: Purchase[] | null) => {
  if (billingResult.responseCode === BillingResponseCode.OK && purchases) {
    for (const purchase of purchases) {
      if (purchase.purchaseState === PurchaseState.PURCHASED && !purchase.isAcknowledged) {
        acknowledgePurchase(purchase.purchaseToken);
        setPurchaseStatus(true);
      }
    }
  }
};

export const launchBillingFlow = async () => {
  if (!billingClient) return;
  
  const productList = await billingClient.queryProductDetails({
    productIds: [PRODUCT_ID],
    productType: ProductType.INAPP,
  });
  
  if (productList.productDetails.length > 0) {
    const billingFlowParams = BillingFlowParams.newBuilder()
      .setProductDetailsParamsList([...])
      .build();
    
    billingClient.launchBillingFlow(activity, billingFlowParams);
  }
};
```

## Passo 4: Usando o Botão de Compra

O componente `RemoveAdsPurchaseButton` já está pronto para uso e pode ser adicionado ao app:

```tsx
import { RemoveAdsPurchaseButton } from './shared/components/RemoveAdsPurchaseButton';

// No seu componente:
<RemoveAdsPurchaseButton style={{ marginVertical: 16 }} />
```

## Passo 5: Testes

### Testes em Desenvolvimento:
1. Publique uma versão do APK/AAB no track de testes interno
2. Convide sua conta Google para testes
3. Instale o app via Google Play e teste a compra com sua conta de teste

### Contas de Teste:
No Play Console, adicione contas de teste em **Configurações** > **Contas de testes**

## Passo 6: Verificação de Compra

O app verifica automaticamente o status de compra ao iniciar através do contexto `PurchaseContext`:

- ✅ Carrega status do AsyncStorage (cache local)
- ✅ Se comprado: remove anúncios
- ✅ Se não comprado: exibe botão de compra

## Estrutura de Arquivos

```
src/shared/
├── services/
│   └── billing.ts (serviço de Billing)
├── contexts/
│   └── PurchaseContext.tsx (contexto de estado de compra)
├── hooks/
│   └── useBillingPurchase.ts (hook para gerenciar compra)
└── components/
    └── RemoveAdsPurchaseButton.tsx (botão de compra)
```

## Variáveis de Ambiente

Nenhuma configuração de variáveis de ambiente é necessária, pois o ID do produto é definido no código.

## Troubleshooting

### "Billing indisponível neste runtime"
- Deve usar um desenvolvimento build nativo (`expo run:android`), não Expo Go
- Ou publicar um APK/AAB assinado

### Compra não reconhecida
- Verifique se o ID do produto em `billing.ts` corresponde exatamente ao ID do Play Console
- Limpe cache do app: **Configurações** > **Apps** > **seu app** > **Armazenamento** > **Limpar Cache**

### Anúncios ainda aparecem após compra
- Reinicie o app após compra
- Verifique em **Configurações do App** que a compra foi reconhecida

## Referências

- [Play Billing Library GitHub](https://github.com/google/play-billing-samples)
- [Documentação Oficial](https://developer.android.com/google/play/billing)
- [React Native Google Mobile Ads](https://www.npmjs.com/package/react-native-google-mobile-ads)

---

**Última atualização**: Março 2026
