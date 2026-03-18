import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './ComoJogarTruco.css';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';
import { useThemeStyles } from '../../../shared/hooks/useThemeStyles';
import AdSense from '../../../shared/components/AdSense/AdSense';

interface ComoJogarTrucoProps {
  onBack: () => void;
  onPlayTruco: () => void;
}

const ComoJogarTruco: React.FC<ComoJogarTrucoProps> = ({ onBack, onPlayTruco }) => {
  const themeStyles = useThemeStyles();

  return (
    <div
      className="como-jogar-truco-container"
      style={{
        backgroundColor: themeStyles.containerBg,
        color: themeStyles.textPrimary,
      }}
    >
      <div className="como-jogar-truco-header">
        <button
          className="como-jogar-truco-back-btn"
          onClick={onBack}
          style={{ color: themeStyles.textPrimary, borderColor: themeStyles.buttonSecondary.border }}
          aria-label="Voltar"
        >
          <ArrowLeft size={22} />
          Voltar
        </button>
        <ThemeToggle />
      </div>

      <main className="como-jogar-truco-content">
        <h1 className="como-jogar-truco-title">Como jogar truco</h1>
        <p className="como-jogar-truco-subtitle" style={{ color: themeStyles.textSecondary }}>
          Tutorial completo para iniciantes aprenderem as regras, a pontuação e as melhores decisões durante a partida.
        </p>

        <section className="como-jogar-truco-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>O que você vai aprender neste tutorial</h2>
          <ul>
            <li><strong>Para iniciantes:</strong> objetivo, pontuação, rodadas e noções de risco.</li>
            <li><strong>Nível intermediário:</strong> blefe, leitura de adversário, gestão de placar e erros comuns.</li>
            <li><strong>Fechamento prático:</strong> passo a passo direto para começar a jogar hoje.</li>
          </ul>
        </section>

        <AdSense />

        <section className="como-jogar-truco-level" aria-label="Bloco para iniciantes">
          <h2 className="como-jogar-truco-level-title">Para iniciantes</h2>
          <p className="como-jogar-truco-level-subtitle" style={{ color: themeStyles.textSecondary }}>
            Aqui ficam os fundamentos para você começar com segurança e entender o ritmo do jogo.
          </p>
        </section>

        <section className="como-jogar-truco-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>O que é Truco e qual é o objetivo</h2>
          <p>
            Truco é um jogo de cartas muito popular no Brasil, com partidas dinâmicas, blefe e leitura do adversário.
            Em termos simples, o objetivo é fazer <strong>12 pontos</strong> antes da dupla rival. A base da pontuação
            começa em 1 ponto por mão, mas esse valor pode subir ao longo da disputa quando alguém pede truco.
          </p>
          <p>
            Além da sorte na distribuição das cartas, o Truco premia tomada de decisão: quando aceitar um aumento,
            quando correr, quando pressionar e quando segurar o jogo. Por isso, jogadores iniciantes conseguem se divertir
            desde o primeiro dia, mas também evoluem bastante com prática e estratégia.
          </p>
        </section>

        <section className="como-jogar-truco-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Quantidade de jogadores e formato da mesa</h2>
          <p>
            O formato mais conhecido é <strong>2 contra 2</strong>, em duplas. Também dá para jogar no 1 contra 1,
            especialmente para treino. Em partidas de dupla, cada pessoa precisa coordenar o ritmo com o parceiro,
            observando as jogadas da equipe e dos adversários.
          </p>
          <p>
            Antes de começar, vale combinar regras da casa: algumas variações mudam ordem de cartas, empate de rodada,
            valor de mão de 11 e detalhes de canto. Esse alinhamento evita discussões no meio da partida e deixa o jogo
            mais fluido para todo mundo.
          </p>
        </section>

        <section className="como-jogar-truco-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Como funciona a pontuação da mão</h2>
          <p>
            Em geral, a mão começa valendo 1 ponto. Conforme os jogadores desafiam os adversários, esse valor pode subir.
            No marcador do app, você encontra os valores principais usados no dia a dia:
          </p>
          <ul>
            <li>Mão normal: 1 ponto</li>
            <li>Truco: 3 pontos</li>
            <li>Seis: 6 pontos</li>
            <li>Nove: 9 pontos</li>
            <li>Doze: 12 pontos</li>
          </ul>
          <p>
            Sempre que uma equipe aumenta a aposta, a outra equipe pode aceitar ou correr. Se correr, não disputa o resto
            da mão e cede a pontuação do valor anterior para quem pediu. Isso torna cada decisão valiosa, porque aceitar sem
            cartas boas pode custar caro, mas correr cedo demais também pode entregar pontos de forma fácil.
          </p>
          <p>
            Dica para iniciantes: se você ainda está pegando o ritmo, não precisa entrar em todas as subidas de aposta.
            Observe o histórico da partida, o placar atual e a postura do oponente antes de responder ao pedido.
          </p>
        </section>

        <section className="como-jogar-truco-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Rodadas e vitória da mão</h2>
          <p>
            Cada mão tem até três rodadas. Em cada rodada, os jogadores jogam uma carta e a equipe com a carta mais forte
            vence aquela rodada. A dupla que conquistar <strong>duas rodadas</strong> primeiro vence a mão inteira.
          </p>
          <p>
            Se houver empate em alguma rodada, o desfecho costuma depender da regra combinada antes do jogo.
            Como existem variações regionais, o ideal é alinhar isso no início da partida. Esse cuidado simples evita dúvidas
            e mantém o foco na diversão.
          </p>
        </section>

        <section className="como-jogar-truco-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Quando pedir truco e quando correr</h2>
          <p>
            Um erro comum de quem começa é pedir truco em todas as mãos fortes e nunca blefar. Truco funciona melhor quando
            existe imprevisibilidade. Às vezes, você pode pressionar com mão mediana para forçar o adversário a correr.
            Em outras, pode segurar uma mão forte para ganhar sem alarde e manter leitura difícil para a rodada seguinte.
          </p>
          <p>
            Correr também faz parte da estratégia. Correr não é "perder de graça"; muitas vezes é a decisão mais inteligente
            para reduzir dano e preservar chances no restante da partida. Jogador experiente escolhe bem as batalhas.
          </p>
          <p>
            Regra prática: se seu time está perto de fechar 12 pontos, vale priorizar decisões mais seguras. Se está atrás no
            placar, pode ser necessário assumir riscos calculados para buscar virada.
          </p>
        </section>

        <section className="como-jogar-truco-level" aria-label="Bloco de nível intermediário">
          <h2 className="como-jogar-truco-level-title">Nível intermediário</h2>
          <p className="como-jogar-truco-level-subtitle" style={{ color: themeStyles.textSecondary }}>
            Depois de dominar o básico, use estas ideias para evoluir leitura de mesa e tomada de decisão.
          </p>
        </section>

        <section className="como-jogar-truco-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Estratégias para iniciantes evoluírem rápido</h2>
          <p>
            A primeira estratégia é memorizar a força das cartas na variação que vocês escolheram. Não precisa decorar tudo em
            um dia: avance mão a mão. A segunda é observar padrão dos adversários. Tem jogador que sempre aumenta aposta quando
            está forte; outros usam blefe com frequência. Reconhecer padrões aumenta muito sua taxa de acerto.
          </p>
          <p>
            Outra dica importante é pensar no conjunto da mão, não em uma carta isolada. Às vezes uma carta aparentemente fraca
            pode ser útil para "queimar" rodada, guardar carta decisiva para o momento certo e vencer no final. O Truco é jogo
            de sequência, leitura e timing.
          </p>
          <p>
            Também ajuda registrar pontos com atenção, para evitar confusão. O marcador digital facilita esse controle e permite
            focar na jogada, sem interrupções para conferir placar toda hora.
          </p>
        </section>

        <section className="como-jogar-truco-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Comunicação em dupla e postura na mesa</h2>
          <p>
            Em partidas de dupla, comunicação clara e respeitosa faz muita diferença. Em ambientes casuais, algumas mesas usam
            sinais tradicionais; em outras, sinais não são permitidos. Novamente, combine isso antes de começar para manter o
            jogo justo para todos.
          </p>
          <p>
            Evite interromper jogadas para discutir regra no calor do momento. Se aparecer divergência, pause, consulte o acordo
            inicial da mesa e retome. Manter bom clima deixa a partida mais divertida e favorece encontros futuros.
          </p>
        </section>

        <section className="como-jogar-truco-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Erros frequentes de quem está começando</h2>
          <ul>
            <li>Pedir aumento de aposta sem avaliar o placar e o risco.</li>
            <li>Aceitar todos os pedidos por impulso, sem considerar a força da mão.</li>
            <li>Ignorar combinações de regras da casa antes da partida começar.</li>
            <li>Perder foco no controle de pontos e gerar dúvidas no meio do jogo.</li>
            <li>Desistir de blefar por medo de errar; blefe responsável também se aprende.</li>
          </ul>
          <p>
            O lado positivo é que todos esses erros são normais e melhoram com prática. Jogar com frequência, rever decisões e
            conversar com parceiros mais experientes acelera muito a evolução.
          </p>
        </section>

        <section className="como-jogar-truco-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Passo a passo simples para sua próxima partida</h2>
          <ol>
            <li>Definam a variação do Truco e as regras da casa.</li>
            <li>Comecem a mão valendo 1 ponto.</li>
            <li>Disputem as rodadas e observem o ritmo dos adversários.</li>
            <li>Peçam aumento apenas quando fizer sentido estratégico.</li>
            <li>Aceitem ou corram de forma racional, sem agir no impulso.</li>
            <li>Marquem os pontos corretamente até alguém chegar em 12.</li>
          </ol>
          <p>
            Seguindo esse fluxo, você já consegue jogar bem, aprender rápido e curtir o principal do Truco: a mistura entre
            técnica, leitura de jogo e diversão entre amigos.
          </p>
        </section>

        <button
          className="como-jogar-truco-play-btn"
          onClick={onPlayTruco}
          style={{ backgroundColor: themeStyles.buttonPrimary.bg, color: themeStyles.buttonPrimary.text }}
        >
          Ir para o marcador de Truco
        </button>
      </main>
    </div>
  );
};

export default ComoJogarTruco;
