import React, { useCallback, useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getInterstitialAdUnitId } from '../../services/admob';

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
  const unsubscribeListenersRef = useRef<Array<() => void>>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const adsModule = getGoogleMobileAdsModule();

  const resolvedUnitId =
    unitId ||
    getInterstitialAdUnitId() ||
    adsModule?.TestIds?.INTERSTITIAL ||
    'ca-app-pub-3940256099942544/1033173712';

  const cleanupListeners = useCallback(() => {
    unsubscribeListenersRef.current.forEach((unsubscribe) => unsubscribe());
    unsubscribeListenersRef.current = [];
  }, []);

  const loadInterstitialAd = useCallback(() => {
    try {
      if (!adsModule) {
        return;
      }

      cleanupListeners();
      setIsLoaded(false);

      const { AdEventType, InterstitialAd } = adsModule;
      const ad = InterstitialAd.createForAdRequest(resolvedUnitId, {
        requestNonPersonalizedAdsOnly: false,
        keywords: ['jogo', 'baralho', 'truco', 'cacheta'],
      });

      unsubscribeListenersRef.current = [
        ad.addAdEventListener(AdEventType.LOADED, () => {
          setIsLoaded(true);
        }),
        ad.addAdEventListener(AdEventType.CLOSED, () => {
          setIsLoaded(false);
          loadInterstitialAd();
        }),
        ad.addAdEventListener(AdEventType.ERROR, (error: unknown) => {
          setIsLoaded(false);
          console.log('Erro no ciclo do Interstitial Ad:', error);
        }),
      ];

      interstitialRef.current = ad;
      ad.load();
    } catch (error) {
      setIsLoaded(false);
      console.log('Erro ao carregar Interstitial Ad:', error);
    }
  }, [adsModule, cleanupListeners, resolvedUnitId]);

  const showInterstitialAd = useCallback(async () => {
    try {
      if (interstitialRef.current && isLoaded) {
        await interstitialRef.current.show();
        return true;
      }

      return false;
    } catch (error) {
      setIsLoaded(false);
      console.log('Erro ao mostrar Interstitial Ad:', error);
      return false;
    }
  }, [isLoaded]);

  useEffect(() => {
    if (adsModule) {
      loadInterstitialAd();
    }

    return () => {
      cleanupListeners();
      interstitialRef.current = null;
    };
  }, [adsModule, cleanupListeners, loadInterstitialAd]);

  return {
    isLoaded,
    showInterstitialAd,
    loadInterstitialAd,
  };
};
