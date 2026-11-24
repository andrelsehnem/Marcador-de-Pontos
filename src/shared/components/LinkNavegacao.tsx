import React from 'react';

type LinkNavegacaoProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & {
  href: string;
  onNavigate: () => void;
};

/**
 * Link de navegação interna da web: clique simples navega sem recarregar (SPA);
 * clique com o scroll, Ctrl/Cmd/Shift+clique e "abrir em nova aba" seguem o `href`.
 */
const LinkNavegacao: React.FC<LinkNavegacaoProps> = ({ href, onNavigate, ...rest }) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    onNavigate();
  };

  return <a href={href} onClick={handleClick} {...rest} />;
};

export default LinkNavegacao;
