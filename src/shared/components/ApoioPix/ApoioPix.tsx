import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './ApoioPix.css';
import { registrarEvento } from '../../services/analytics';

// Preencha com a chave Pix (aleatória ou e-mail; evite CPF/telefone, ela fica pública no site).
// Enquanto estiver vazia, o popup não aparece sozinho.
const PIX_CHAVE = '43432dd2-71af-4286-8724-a5f1a3eb4d21';
// Imagem do QR code exportada do app do banco, salva em public/pix-qrcode.png.
const PIX_QRCODE_URL = '/pix-qrcode.png';

const PRIMEIRA_EXIBICAO_MS = 5 * 60 * 1000;
const INTERVALO_EXIBICAO_MS = 20 * 60 * 1000;
const VERIFICACAO_MS = 15 * 1000;
const CHAVE_STORAGE = 'apoio-pix-v1';

interface EstadoApoio {
  dia: string;
  inicioDia: number;
  ultimaExibicao: number | null;
}

const hoje = () => {
  const agora = new Date();
  return `${agora.getFullYear()}-${agora.getMonth() + 1}-${agora.getDate()}`;
};

const salvarEstado = (estado: EstadoApoio) => {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(estado));
  } catch {
    // Sem armazenamento, o controle vale só para esta aba.
  }
};

/** Lê o estado do dia; num dia novo, recomeça a contagem dos 5 minutos. */
const lerEstado = (): EstadoApoio => {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_STORAGE) || 'null') as EstadoApoio | null;
    if (salvo && salvo.dia === hoje()) {
      return salvo;
    }
  } catch {
    // Valor inválido: recomeça.
  }

  const novo: EstadoApoio = { dia: hoje(), inicioDia: Date.now(), ultimaExibicao: null };
  salvarEstado(novo);
  return novo;
};

/** Primeira vez no dia: 5 min após o primeiro acesso. Depois: a cada 20 min. */
const proximaExibicao = (estado: EstadoApoio) =>
  estado.ultimaExibicao === null
    ? estado.inicioDia + PRIMEIRA_EXIBICAO_MS
    : estado.ultimaExibicao + INTERVALO_EXIBICAO_MS;

const copiarTexto = async (texto: string) => {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const campo = document.createElement('textarea');
    campo.value = texto;
    campo.setAttribute('readonly', '');
    campo.style.position = 'fixed';
    campo.style.opacity = '0';
    document.body.appendChild(campo);
    campo.select();
    const copiou = document.execCommand('copy');
    document.body.removeChild(campo);
    return copiou;
  }
};

const ApoioPix: React.FC = () => {
  const [aberto, setAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [qrIndisponivel, setQrIndisponivel] = useState(false);

  useEffect(() => {
    // `?apoio=teste` abre o popup na hora, para conferir o visual.
    if (new URLSearchParams(window.location.search).get('apoio') === 'teste') {
      setAberto(true);
      return;
    }

    if (!PIX_CHAVE) {
      return;
    }

    const verificar = () => {
      if (document.visibilityState !== 'visible') {
        return;
      }

      const estado = lerEstado();
      if (Date.now() < proximaExibicao(estado)) {
        return;
      }

      salvarEstado({ ...estado, ultimaExibicao: Date.now() });
      setCopiado(false);
      setAberto(true);
      registrarEvento('apoio_exibido');
    };

    verificar();
    const intervalo = window.setInterval(verificar, VERIFICACAO_MS);
    return () => window.clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    const aoTeclar = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAberto(false);
      }
    };

    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [aberto]);

  if (!aberto) {
    return null;
  }

  const fechar = () => setAberto(false);

  const copiarChave = async () => {
    if (!PIX_CHAVE) {
      return;
    }

    if (await copiarTexto(PIX_CHAVE)) {
      setCopiado(true);
      registrarEvento('apoio_copiar_chave');
    }
  };

  // Portal no <body>: fica acima de qualquer página, sem depender do z-index de cada uma.
  return createPortal(
    <div className="apoio-overlay" onClick={fechar}>
      <div
        className="apoio-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apoio-titulo"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="apoio-fechar" onClick={fechar} aria-label="Fechar">×</button>

        <span className="apoio-icone" aria-hidden="true">♥</span>
        <h2 id="apoio-titulo" className="apoio-titulo">Apoie o projeto</h2>
        <p className="apoio-texto">
          O Marcador de Pontos é gratuito e feito por uma pessoa só. Apoie com o quanto você achar necessário.
        </p>

        <div className="apoio-qrcode">
          {qrIndisponivel ? (
            <span className="apoio-qrcode-vazio">QR code indisponível</span>
          ) : (
            <img src={PIX_QRCODE_URL} alt="QR code Pix para apoiar o projeto" onError={() => setQrIndisponivel(true)} />
          )}
        </div>

        {PIX_CHAVE ? (
          <p className="apoio-chave">{PIX_CHAVE}</p>
        ) : (
          <p className="apoio-chave">Chave Pix não configurada</p>
        )}

        <button className="apoio-copiar" onClick={copiarChave} disabled={!PIX_CHAVE}>
          {copiado ? '✓ Chave copiada!' : 'Copiar chave Pix'}
        </button>

        <button className="apoio-depois" onClick={fechar}>Agora não</button>
      </div>
    </div>,
    document.body
  );
};

export default ApoioPix;
