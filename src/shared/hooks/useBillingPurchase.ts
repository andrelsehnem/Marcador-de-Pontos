import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as RNIap from 'react-native-iap';
import { ErrorCode } from 'react-native-iap';
import {
  PRODUCT_ID,
  PROMOTIONAL_OFFER_ID,
  getProductDetails,
  setPurchaseStatus,
  isBillingSupportedRuntime,
} from '../services/billing';
import { usePurchase } from '../contexts/PurchaseContext';

const getPurchaseErrorMessage = (error: { code?: string | null }) => {
  if (error.code === ErrorCode.DeveloperError) {
    return 'Configuração inválida para compra. Verifique se está em build nativo (não Expo Go), se o produto existe no Play Console e se o app foi instalado via Play no track de teste.';
  }

  return 'Não foi possível completar a compra. Tente novamente.';
};

const getPromotionalOfferToken = (product: RNIap.ProductAndroid): string | null => {
  const discountOffer = product.discountOffers?.find(
    (offer) =>
      offer.id === PROMOTIONAL_OFFER_ID ||
      offer.purchaseOptionIdAndroid === PROMOTIONAL_OFFER_ID
  );

  if (discountOffer?.offerTokenAndroid) {
    return discountOffer.offerTokenAndroid;
  }

  const legacyOffer = product.oneTimePurchaseOfferDetailsAndroid?.find(
    (offer) => offer.offerId === PROMOTIONAL_OFFER_ID || offer.purchaseOptionId === PROMOTIONAL_OFFER_ID
  );

  return legacyOffer?.offerToken || null;
};

export const useBillingPurchase = () => {
  const [loading, setLoading] = useState(false);
  const { refreshPurchaseStatus } = usePurchase();

  useEffect(() => {
    if (!isBillingSupportedRuntime()) return;

    // Listener de compra concluída
    const purchaseUpdatedSub = RNIap.purchaseUpdatedListener(async (purchase) => {
      if (purchase.productId === PRODUCT_ID) {
        try {
          // Reconhece a compra para a Play Store não devolvê-la
          await RNIap.finishTransaction({ purchase, isConsumable: false });
          await setPurchaseStatus(true);
          await refreshPurchaseStatus();
          Alert.alert('Sucesso!', 'Anúncios removidos. Obrigado pela compra!');
        } catch (error) {
          console.log('Erro ao finalizar transação:', error);
        } finally {
          setLoading(false);
        }
      }
    });

    // Listener de erro na compra
    const purchaseErrorSub = RNIap.purchaseErrorListener((error) => {
      // UserCancelled indica que o usuário fechou o dialog sem comprar
      if (error.code !== ErrorCode.UserCancelled) {
        console.log('Erro na compra:', error);
        Alert.alert('Erro', getPurchaseErrorMessage(error));
      }
      setLoading(false);
    });

    return () => {
      purchaseUpdatedSub.remove();
      purchaseErrorSub.remove();
    };
  }, [refreshPurchaseStatus]);

  const launchBillingFlow = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert('Não disponível', 'Compras estão disponíveis apenas no Android.');
      return;
    }

    if (!isBillingSupportedRuntime()) {
      Alert.alert(
        'Compras indisponíveis',
        'Use uma versão Android instalada via Play Store ou Development Build (não funciona no Expo Go).'
      );
      return;
    }

    try {
      setLoading(true);
      await RNIap.initConnection();

      const product = await getProductDetails();
      if (!product) {
        Alert.alert(
          'Produto indisponível',
          `O item de compra (${PRODUCT_ID}) não foi encontrado na Play Store para este app/conta.`
        );
        setLoading(false);
        return;
      }

      const sku = product.id || PRODUCT_ID;
      if (!sku) {
        Alert.alert('Erro', 'SKU de compra inválido. Verifique a configuração do PRODUCT_ID.');
        setLoading(false);
        return;
      }

      const promotionalOfferToken = getPromotionalOfferToken(product);
      if (!promotionalOfferToken) {
        Alert.alert(
          'Oferta promocional indisponível',
          `A oferta ${PROMOTIONAL_OFFER_ID} não foi encontrada para este usuário. Compra bloqueada para evitar cobrança no preço cheio.`
        );
        setLoading(false);
        return;
      }

      await RNIap.requestPurchase({
        type: 'in-app',
        request: {
          google: { skus: [sku], offerToken: promotionalOfferToken },
        },
      });
      // O resultado chega via purchaseUpdatedListener acima
    } catch (error: any) {
      if (error?.code !== ErrorCode.UserCancelled) {
        console.log('Erro ao iniciar compra:', error);
        Alert.alert('Erro', getPurchaseErrorMessage(error));
      }
      setLoading(false);
    }
  };

  return {
    launchBillingFlow,
    loading,
  };
};
