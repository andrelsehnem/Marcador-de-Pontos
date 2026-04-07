import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useBillingPurchase } from '../hooks/useBillingPurchase';
import { usePurchase } from '../contexts/PurchaseContext';
import { useTheme } from '../contexts/ThemeContext';

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

  const isDark = theme === 'dark';
  const backgroundColor = isDark ? colors.primary : colors.secondaryDark;
  const textColor = '#ffffff';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        style,
      ]}
      onPress={launchBillingFlow}
      disabled={loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.buttonText, { color: textColor }, textStyle]}>
          Remover Anúncios
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
