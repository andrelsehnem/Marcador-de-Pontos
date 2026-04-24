import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNIap from 'react-native-iap';

// ID do produto único criado no Play Console
export const PRODUCT_ID = 'no_ads_marcador_pontos_1';
export const PROMOTIONAL_OFFER_ID = 'oferta-noads-marcadorpontos1';

const PURCHASE_STORAGE_KEY = 'app-purchase-remove-ads';

export const isBillingSupportedRuntime = () => {
  if (Platform.OS !== 'android') return false;
  if (Constants.appOwnership === 'expo') return false;
  return true;
};

/**
 * Inicializa a conexão com o Play Billing
 */
export const initializeBilling = async () => {
  try {
    if (!isBillingSupportedRuntime()) return;
    await RNIap.initConnection();
    console.log('Billing inicializado com sucesso');
  } catch (error) {
    console.log('Erro ao inicializar Billing:', error);
  }
};

/**
 * Encerra a conexão com o Play Billing
 */
export const endBilling = async () => {
  try {
    if (!isBillingSupportedRuntime()) return;
    await RNIap.endConnection();
  } catch (error) {
    console.log('Erro ao encerrar Billing:', error);
  }
};

/**
 * Verifica se o usuário já comprou o produto.
 * Consulta o cache local e, se o runtime suportar, consulta também as compras disponíveis na Play Store.
 */
export const checkPurchaseStatus = async (): Promise<boolean> => {
  try {
    const cached = await AsyncStorage.getItem(PURCHASE_STORAGE_KEY);
    if (cached === 'true') return true;

    if (!isBillingSupportedRuntime()) return false;

    await RNIap.initConnection();
    const purchases = await RNIap.getAvailablePurchases();
    const hasPurchased = purchases.some(p => p.productId === PRODUCT_ID);

    if (hasPurchased) {
      await AsyncStorage.setItem(PURCHASE_STORAGE_KEY, 'true');
    }

    return hasPurchased;
  } catch (error) {
    console.log('Erro ao verificar status de compra:', error);
    return false;
  }
};

/**
 * Persiste o status de compra localmente
 */
export const setPurchaseStatus = async (purchased: boolean) => {
  try {
    await AsyncStorage.setItem(PURCHASE_STORAGE_KEY, String(purchased));
    console.log('Status de compra atualizado:', purchased);
  } catch (error) {
    console.log('Erro ao atualizar status de compra:', error);
  }
};

/**
 * Consulta os detalhes do produto na Play Store
 */
export const getProductDetails = async (): Promise<RNIap.ProductAndroid | null> => {
  try {
    const products = await RNIap.fetchProducts({ skus: [PRODUCT_ID] });
    const product = products[0];
    if (product && product.type === 'in-app') {
      return product as RNIap.ProductAndroid;
    }
    return null;
  } catch (error) {
    console.log('Erro ao obter detalhes do produto:', error);
    return null;
  }
};
