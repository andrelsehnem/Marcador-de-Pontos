import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './ComoJogarCacheta.css';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';
import { useThemeStyles } from '../../../shared/hooks/useThemeStyles';
import AdSense from '../../../shared/components/AdSense/AdSense';

interface ComoJogarCachetaProps {
  onBack: () => void;
  onPlayCacheta: () => void;
}

const ComoJogarCacheta: React.FC<ComoJogarCachetaProps> = ({ onBack, onPlayCacheta }) => {
  const themeStyles = useThemeStyles();

  return (
    <div
      className="como-jogar-cacheta-container"
      style={{
        backgroundColor: themeStyles.containerBg,
        color: themeStyles.textPrimary,
      }}
    >
      <div className="como-jogar-cacheta-header">
        <button
          className="como-jogar-cacheta-back-btn"
          onClick={onBack}
          style={{ color: themeStyles.textPrimary, borderColor: themeStyles.buttonSecondary.border }}
          aria-label="Voltar"
        >
          <ArrowLeft size={22} />
          Voltar
        </button>
        <ThemeToggle />
      </div>

      <main className="como-jogar-cacheta-content">
        <h1 className="como-jogar-cacheta-title">Como jogar cacheta</h1>
        <p className="como-jogar-cacheta-subtitle" style={{ color: themeStyles.textSecondary }}>
          Tutorial completo para entender a lógica da Cacheta, organizar sua mão e jogar com mais estratégia.
        </p>

        <section className="como-jogar-cacheta-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>O que você vai aprender neste guia</h2>
          <ul>
            <li><strong>Para iniciantes:</strong> objetivo, estrutura da rodada e noções de combinação.</li>
            <li><strong>Nível intermediário:</strong> leitura de descarte, gestão de risco e decisões de fechamento.</li>
            <li><strong>Aplicação prática:</strong> checklist simples para sua próxima partida.</li>
          </ul>
        </section>

        <AdSense />

        <section className="como-jogar-cacheta-level" aria-label="Bloco para iniciantes">
          <h2 className="como-jogar-cacheta-level-title">Para iniciantes</h2>
          <p className="como-jogar-cacheta-level-subtitle" style={{ color: themeStyles.textSecondary }}>
            Esta parte cobre os fundamentos para você começar sem travar no meio da mesa.
          </p>
        </section>

        <section className="como-jogar-cacheta-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>O que é Cacheta e qual é o objetivo</h2>
          <p>
            A Cacheta é um jogo de cartas em que você busca organizar sua mão em combinações válidas para “bater” antes dos
            adversários. Em muitas mesas, as combinações envolvem trincas (mesmo valor) e sequências do mesmo naipe.
            Apesar das variações regionais, a essência permanece: administrar a mão com eficiência, comprando e descartando
            cartas com inteligência até completar o jogo.
          </p>
          <p>
            Diferente de jogos em que você apenas responde à rodada, na Cacheta cada jogada muda as possibilidades futuras.
            Isso significa que planejar dois ou três movimentos à frente costuma fazer muita diferença. Quem aprende a pensar
            em blocos de combinação evolui mais rápido e reduz erros por impulso.
          </p>
        </section>

        <section className="como-jogar-cacheta-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Quantidade de jogadores e preparação da mesa</h2>
          <p>
            A Cacheta normalmente é jogada com 2 a 6 pessoas, dependendo da regra local e da quantidade de baralhos usados.
            Antes de iniciar, vale combinar como será a pontuação, quantas cartas cada jogador recebe e qual condição define
            vitória da rodada e da partida inteira.
          </p>
          <p>
            Esse acordo prévio parece detalhe pequeno, mas evita confusão quando o jogo esquenta. Quando todos conhecem as
            mesmas regras, a partida flui melhor, as decisões ficam mais justas e o aprendizado de quem está começando aumenta.
          </p>
        </section>

        <section className="como-jogar-cacheta-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Fluxo básico de uma jogada</h2>
          <ol>
            <li>Você analisa sua mão e identifica quais grupos já estão quase prontos.</li>
            <li>Compra uma carta do monte (ou da pilha de descarte, dependendo da regra da mesa).</li>
            <li>Reavalia as combinações possíveis após a compra.</li>
            <li>Descarta uma carta que menos contribui para fechar suas combinações.</li>
            <li>Passa a vez para o próximo jogador.</li>
          </ol>
          <p>
            Esse ciclo se repete até alguém bater. Em partidas com ritmo acelerado, o segredo é não perder tempo com cartas
            desconectadas do seu plano principal. Quanto mais claro o objetivo da sua mão, mais consistente tende a ser seu jogo.
          </p>
        </section>

        <section className="como-jogar-cacheta-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Como pensar em combinações sem se confundir</h2>
          <p>
            Um erro comum de iniciantes é tentar fechar muitas ideias ao mesmo tempo. A estratégia mais segura é escolher uma
            estrutura principal: por exemplo, focar duas combinações quase prontas e uma terceira em desenvolvimento. Assim, você
            evita dispersão e ganha clareza sobre qual carta deve sair em cada turno.
          </p>
          <p>
            Outra dica prática é separar mentalmente cartas “núcleo” e cartas “flexíveis”. Núcleo são aquelas que já pertencem a
            combinações com alta chance de fechamento. Flexíveis são cartas que podem entrar em mais de uma opção. Esse raciocínio
            ajuda a decidir descarte com menos arrependimento.
          </p>
        </section>

        <section className="como-jogar-cacheta-level" aria-label="Bloco de nível intermediário">
          <h2 className="como-jogar-cacheta-level-title">Nível intermediário</h2>
          <p className="como-jogar-cacheta-level-subtitle" style={{ color: themeStyles.textSecondary }}>
            Aqui entram decisões de leitura de mesa e gestão de risco para aumentar sua consistência.
          </p>
        </section>

        <section className="como-jogar-cacheta-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Leitura de descarte e informação de mesa</h2>
          <p>
            Na Cacheta, o descarte conta uma história. Se um adversário descarta repetidamente cartas de um naipe específico,
            é provável que ele não esteja montando sequência com aquele naipe. Se ele evita descartar determinado valor por várias
            rodadas, existe chance de essa carta ser peça importante na mão dele.
          </p>
          <p>
            Você não precisa acertar todas as leituras. O objetivo é acumular sinais suficientes para tomar decisões melhores do
            que decisões aleatórias. Com o tempo, esse hábito aumenta sua taxa de mãos bem resolvidas e reduz jogadas precipitadas.
          </p>
        </section>

        <section className="como-jogar-cacheta-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Gestão de risco: insistir ou reorganizar a mão</h2>
          <p>
            Em certas rodadas, insistir na mesma combinação por muito tempo pode travar sua evolução. Se faltam várias cartas
            improváveis para fechar um bloco, talvez seja melhor reorganizar o plano e construir com o que a mesa está oferecendo.
            Jogador consistente é aquele que sabe abandonar uma ideia ruim na hora certa.
          </p>
          <p>
            Esse ajuste estratégico fica ainda mais importante quando outro jogador acelera o ritmo de compra e descarte.
            Se a mesa está rápida, decisões conservadoras demais podem te deixar para trás. Equilibrar paciência e adaptação é
            um diferencial real no resultado final.
          </p>
        </section>

        <section className="como-jogar-cacheta-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Erros frequentes na Cacheta</h2>
          <ul>
            <li>Guardar carta fraca por apego, mesmo sem função no plano da mão.</li>
            <li>Descartar peça útil por pressa, sem revisar as combinações possíveis.</li>
            <li>Ignorar o padrão de descarte dos adversários.</li>
            <li>Trocar de estratégia a cada turno sem critério.</li>
            <li>Esquecer de alinhar regras da casa e gerar conflito no fechamento.</li>
          </ul>
          <p>
            Reconhecer esses pontos cedo acelera sua evolução. A melhoria na Cacheta costuma ser rápida quando você revisa
            decisões com calma depois de cada partida.
          </p>
        </section>

        <section className="como-jogar-cacheta-card" style={{ backgroundColor: themeStyles.surface, borderColor: themeStyles.buttonSecondary.border }}>
          <h2>Checklist para sua próxima partida</h2>
          <ol>
            <li>Confirmar regras da casa e pontuação antes de começar.</li>
            <li>Definir uma estrutura principal para a mão já no início.</li>
            <li>Usar compra e descarte com propósito, evitando cartas sem função.</li>
            <li>Observar padrões dos adversários e ajustar o plano.</li>
            <li>Reorganizar a estratégia quando a mão travar.</li>
            <li>Manter controle de pontos no marcador para não perder contexto.</li>
          </ol>
          <p>
            Com esse processo, você joga com mais clareza, reduz erros por ansiedade e aumenta as chances de bater no momento
            certo. A Cacheta fica muito mais divertida quando você entende não só “o que fazer”, mas também “por que fazer”.
          </p>
        </section>

        <button
          className="como-jogar-cacheta-play-btn"
          onClick={onPlayCacheta}
          style={{ backgroundColor: themeStyles.buttonPrimaryAlt.bg, color: '#ffffff' }}
        >
          Ir para o marcador de Cacheta
        </button>
      </main>
    </div>
  );
};

export default ComoJogarCacheta;
