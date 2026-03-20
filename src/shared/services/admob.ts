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

export const AD_IDS = {
  APP: 'ca-app-pub-7478664676745892~3869488742',
  INTERSTITIAL: {
    android: 'ca-app-pub-7478664676745892/4665560047',
    ios: 'ca-app-pub-7478664676745892/4665560047',
  },
};

export const getInterstitialAdUnitId = () =>
  Platform.select(AD_IDS.INTERSTITIAL) ?? AD_IDS.INTERSTITIAL.android;
