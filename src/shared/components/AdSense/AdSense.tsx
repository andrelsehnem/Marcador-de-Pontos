import React from 'react';
import { ADSENSE_CONFIG } from '../../constants/adsense';

interface AdSenseProps {
  slot?: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSense: React.FC<AdSenseProps> = ({ 
  slot, 
  format = 'auto', 
  responsive = true,
  style = { display: 'block', marginTop: '20px', marginBottom: '20px' }
}) => {
  // Se não tiver slot, o Auto Ads do Google será gerenciado automaticamente pelo script no head
  if (!slot) {
    return null; // Não renderizar nada - Auto Ads funciona sem componentes específicos
  }

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
    />
  );
};

export default AdSense;
