import React from 'react';
import './NaoEncontrada.css';

type Destino = 'landing' | 'listajogos';

interface NaoEncontradaProps {
  onNavigate: (page: Destino) => void;
}

const CARTAS: { valor: string; naipe: string; vermelha: boolean }[] = [
  { valor: '4', naipe: '♠', vermelha: false },
  { valor: '0', naipe: '♦', vermelha: true },
  { valor: '4', naipe: '♥', vermelha: true },
];

const NAIPES_FUNDO = ['♠', '♥', '♦', '♣', '♥', '♠'];

const NaoEncontrada: React.FC<NaoEncontradaProps> = ({ onNavigate }) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, page: Destino) => {
    event.preventDefault();
    onNavigate(page);
  };

  return (
    <div className="nf-page">
      <div className="nf-stars" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="nf-star"
            style={{
              left: `${(index * 17) % 100}%`,
              top: `${(index * 29) % 100}%`,
              animationDelay: `${(index % 7) * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="nf-naipes" aria-hidden="true">
        {NAIPES_FUNDO.map((naipe, index) => (
          <span key={index} className={`nf-naipe nf-naipe-${index + 1}`}>
            {naipe}
          </span>
        ))}
      </div>

      <div className="nf-content">
        <div className="nf-mao" role="img" aria-label="Erro 404">
          {CARTAS.map((carta, index) => (
            <div key={index} className={`nf-carta-slot nf-carta-slot-${index + 1}`}>
              <div className={`nf-carta${carta.vermelha ? ' nf-carta-vermelha' : ''}`}>
                <span className="nf-carta-canto">
                  {carta.valor}
                  <small>{carta.naipe}</small>
                </span>
                <span className="nf-carta-valor">{carta.valor}</span>
                <span className="nf-carta-canto nf-carta-canto-inverso">
                  {carta.valor}
                  <small>{carta.naipe}</small>
                </span>
              </div>
            </div>
          ))}
        </div>

        <h1 className="nf-title">
          Essa carta não está no <span>baralho</span>
        </h1>
        <p className="nf-subtitle">
          O endereço que você abriu não existe ou foi alterado. Embaralhe de novo e volte para a mesa.
        </p>

        <nav className="nf-links" aria-label="Por onde continuar">
          <a className="nf-link nf-link-primario" href="/" onClick={(event) => handleClick(event, 'landing')}>
            Página inicial
          </a>
          <a className="nf-link" href="/listajogos" onClick={(event) => handleClick(event, 'listajogos')}>
            Lista de jogos e marcadores
          </a>
        </nav>
      </div>
    </div>
  );
};

export default NaoEncontrada;
