import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform, View } from 'react-native';
import { useBillingPurchase } from '../hooks/useBillingPurchase';
import { usePurchase } from '../contexts/PurchaseContext';
import { useTheme } from '../contexts/ThemeContext';
import { isBillingSupportedRuntime } from '../services/billing';

interface RemoveAdsPurchaseButtonProps {
  style?: any;
  textStyle?: any;
}

export const RemoveAdsPurchaseButton: React.FC<RemoveAdsPurchaseButtonProps> = ({
  style,
  textStyle,
}) => {
  const { launchBillingFlow, loading } = useBillingPurchase();
  const { isPurchased } = usePurchase();
  const { theme, colors } = useTheme();

  // Não mostrar botão se a compra já foi feita
  if (isPurchased) {
    return null;
  }

  // Não mostrar botão em plataformas não-Android
  if (Platform.OS !== 'android') {
    return null;
  }

  if (!isBillingSupportedRuntime()) {
    return null;
  }

  const isDark = theme === 'dark';
  const backgroundColor = isDark ? colors.danger : colors.primary;
  const textColor = colors.surface;
  const badgeBackgroundColor = colors.warning;
  const badgeTextColor = colors.text.primary;
  const subtitleColor = colors.surface;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor: colors.warning,
          shadowColor: colors.danger,
        },
        style,
      ]}
      onPress={launchBillingFlow}
      disabled={loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.contentContainer}>
          <View style={[styles.offerBadge, { backgroundColor: badgeBackgroundColor }]}>
            <Text style={[styles.offerText, { color: badgeTextColor }]}>OFERTA ESPECIAL</Text>
          </View>
          <Text style={[styles.buttonText, { color: textColor }, textStyle]}>
            🔥 Remover Anúncios
          </Text>
          <Text style={[styles.subtitleText, { color: subtitleColor }]}>Pague menos agora</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  contentContainer: {
    alignItems: 'center',
    gap: 4,
  },
  offerBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  offerText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
