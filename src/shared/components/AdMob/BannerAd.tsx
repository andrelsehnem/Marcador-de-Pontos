import React from 'react';
import Constants from 'expo-constants';
import { View, Platform } from 'react-native';
import { usePurchase } from '../../contexts/PurchaseContext';

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
      console.log('AdMob Banner desativado neste runtime (Expo Go/Web).');
      hasWarnedMissingAdMob = true;
    }
    return null;
  }

  try {
    return require('react-native-google-mobile-ads');
  } catch {
    if (!hasWarnedMissingAdMob) {
      console.log('AdMob Banner indisponível no binário atual.');
      hasWarnedMissingAdMob = true;
    }
    return null;
  }
};
interface BannerAdProps {
  unitId?: string;
  size?: string;
}

export const AdMobBanner: React.FC<BannerAdProps> = ({
  unitId,
  size,
}) => {
  const { isPurchased } = usePurchase();
  const adsModule = getGoogleMobileAdsModule();

  // Não renderiza anúncio se o usuário comprou o produto de remover anúncios
  if (isPurchased) {
    return null;
  }

  if (!adsModule) {
    return null;
  }

  const BannerAd = adsModule.BannerAd;
  const BannerAdSize = adsModule.BannerAdSize;
  const TestIds = adsModule.TestIds;

  const resolvedUnitId =
    unitId ||
    Platform.select({
      android: 'ca-app-pub-7478664676745892/4665560047',
      ios: 'ca-app-pub-7478664676745892/2934735716',
    }) ||
    TestIds.BANNER;

  const resolvedSize = size || BannerAdSize.ANCHORED_ADAPTIVE_BANNER;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <BannerAd
        unitId={resolvedUnitId}
        size={resolvedSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          keywords: ['jogo', 'baralho', 'truco', 'cacheta'],
        }}
        onAdFailedToLoad={(error) => {
          console.log('Falha ao carregar anúncio:', error);
        }}
        onAdLoaded={() => {
          console.log('Anúncio carregado com sucesso');
        }}
      />
    </View>
  );
};
