import React, { useEffect, useRef } from 'react';
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
      console.log('AdMob Interstitial desativado neste runtime (Expo Go/Web).');
      hasWarnedMissingAdMob = true;
    }
    return null;
  }

  try {
    return require('react-native-google-mobile-ads');
  } catch {
    if (!hasWarnedMissingAdMob) {
      console.log('AdMob Interstitial indisponível no binário atual.');
      hasWarnedMissingAdMob = true;
    }
    return null;
  }
};
/**
 * Hook para gerenciar Interstitial Ads (anúncios em tela cheia)
 * Útil para mostrar entre partidas, rodadas, etc.
 */
export const useInterstitialAd = (
  unitId?: string
) => {
  const interstitialRef = useRef<any | null>(null);
  const adsModule = getGoogleMobileAdsModule();

  const resolvedUnitId =
    unitId ||
    Platform.select({
      android: 'ca-app-pub-7478664676745892/4665560047',
      ios: 'ca-app-pub-7478664676745892/4665560047',
    }) ||
    adsModule?.TestIds?.INTERSTITIAL ||
    'ca-app-pub-3940256099942544/1033173712';

  const loadInterstitialAd = async () => {
    try {
      if (!adsModule) {
        return;
      }

      const ad = adsModule.InterstitialAd.createForAdRequest(resolvedUnitId);
      interstitialRef.current = ad;
      await ad.load();
    } catch (error) {
      console.log('Erro ao carregar Interstitial Ad:', error);
    }
  };

  const showInterstitialAd = async () => {
    try {
      if (interstitialRef.current) {
        await interstitialRef.current.show();
        // Precarregar próximo anúncio após fechar
        loadInterstitialAd();
      }
    } catch (error) {
      console.log('Erro ao mostrar Interstitial Ad:', error);
    }
  };

  useEffect(() => {
    // Precarregar anúncio quando o hook é montado
    if (adsModule) {
      loadInterstitialAd();
    }
  }, [resolvedUnitId]);

  return {
    showInterstitialAd,
    loadInterstitialAd,
  };
};
