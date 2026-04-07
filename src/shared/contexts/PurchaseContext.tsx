import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { checkPurchaseStatus, initializeBilling } from '../services/billing';

interface PurchaseContextType {
  isPurchased: boolean;
  loading: boolean;
  refreshPurchaseStatus: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Inicializa o Billing
        await initializeBilling();

        // Verifica status de compra ao iniciar o app
        const purchased = await checkPurchaseStatus();
        setIsPurchased(purchased);
      } catch (error) {
        console.log('Erro ao inicializar compras:', error);
        setIsPurchased(false);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const refreshPurchaseStatus = async () => {
    try {
      setLoading(true);
      const purchased = await checkPurchaseStatus();
      setIsPurchased(purchased);
    } catch (error) {
      console.log('Erro ao atualizar status de compra:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PurchaseContext.Provider value={{ isPurchased, loading, refreshPurchaseStatus }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
};
