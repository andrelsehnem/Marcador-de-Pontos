import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as RNIap from 'react-native-iap';
import { ErrorCode } from 'react-native-iap';
import {
  PRODUCT_ID,
  setPurchaseStatus,
  isBillingSupportedRuntime,
} from '../services/billing';
import { usePurchase } from '../contexts/PurchaseContext';

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
        Alert.alert('Erro', 'Não foi possível completar a compra. Tente novamente.');
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

    try {
      setLoading(true);
      await RNIap.initConnection();
      await RNIap.requestPurchase({
        type: 'in-app',
        request: {
          google: { skus: [PRODUCT_ID] },
        },
      });
      // O resultado chega via purchaseUpdatedListener acima
    } catch (error: any) {
      if (error?.code !== ErrorCode.UserCancelled) {
        console.log('Erro ao iniciar compra:', error);
        Alert.alert('Erro', 'Não foi possível iniciar a compra. Verifique sua conexão.');
      }
      setLoading(false);
    }
  };

  return {
    launchBillingFlow,
    loading,
  };
};
