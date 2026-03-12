import Constants from 'expo-constants';
import { Platform } from 'react-native';

let hasWarnedMissingAdMob = false;

const isAdMobSupportedRuntime = () => {
  if (Platform.OS === 'web') {
    return false;
  }

  if (Constants.appOwnership === 'expo') {
    return false;
  }

  return true;
};

const getGoogleMobileAdsModule = () => {
  if (!isAdMobSupportedRuntime()) {
    if (!hasWarnedMissingAdMob) {
      console.log('AdMob desativado neste runtime (Expo Go/Web). Use um Development Build para testar anúncios.');
      hasWarnedMissingAdMob = true;
    }
    return null;
  }

  try {
    return require('react-native-google-mobile-ads');
  } catch {
    if (!hasWarnedMissingAdMob) {
      console.log('AdMob indisponível no binário atual. Rode um build nativo (expo run:android) em vez de Expo Go.');
      hasWarnedMissingAdMob = true;
    }
    return null;
  }
};
/**
 * Inicializa o Google Mobile Ads
 * Deve ser chamado uma vez quando o app inicia
 */
export const initializeAdMob = async () => {
  try {
    const adsModule = getGoogleMobileAdsModule();
    if (!adsModule) {
      return;
    }

    await adsModule.MobileAds().initialize();
    console.log('AdMob inicializado com sucesso');
  } catch (error) {
    console.log('Erro ao inicializar AdMob:', error);
  }
};

/**
 * IDs de teste para desenvolvimento
 * Substitua pelos seus IDs reais de produção
 */
export const AD_IDS = {
  // Banner IDs de teste
  BANNER_ANDROID: 'ca-app-pub-7478664676745892/4665560047',
  BANNER_IOS: 'ca-app-pub-7478664676745892/2934735716',
  
  // Interstitial IDs de teste
  INTERSTITIAL_ANDROID: 'ca-app-pub-7478664676745892/1033173712',
  INTERSTITIAL_IOS: 'ca-app-pub-7478664676745892/4411468910',
  
  // Rewarded IDs de teste
  REWARDED_ANDROID: 'ca-app-pub-7478664676745892/5224354917',
  REWARDED_IOS: 'ca-app-pub-7478664676745892/1712485313',
};
