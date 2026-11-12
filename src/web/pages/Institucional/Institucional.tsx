import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './Institucional.css';
import ThemeToggle from '../../../shared/components/ThemeToggle/ThemeToggle';
import { useThemeStyles } from '../../../shared/hooks/useThemeStyles';
import { PLAY_STORE_URL } from '../../../shared/components/AppPromo/AppPromo';

export type PaginaInstitucional = 'sobre' | 'politica-de-privacidade' | 'contato' | 'nao-encontrada';

const EMAIL_CONTATO = 'andrelsehnem@gmail.com';
const SITE_DESENVOLVEDOR = 'https://andre100.dev';
const ULTIMA_ATUALIZACAO = '12 de novembro de 2026';

interface InstitucionalProps {
  pagina: PaginaInstitucional;
  onBack: () => void;
}

const LinkExterno: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
);

const CanalDeContato: React.FC = () => (
  <ul>
    {EMAIL_CONTATO && (
      <li><strong>E-mail:</strong> <a href={`mailto:${EMAIL_CONTATO}`}>{EMAIL_CONTATO}</a></li>
    )}
    <li><strong>Site do desenvolvedor:</strong> <LinkExterno href={SITE_DESENVOLVEDOR}>andre100.dev</LinkExterno></li>
    <li><strong>Página do app na Play Store:</strong> <LinkExterno href={PLAY_STORE_URL}>Marcador de Pontos para Android</LinkExterno></li>
  </ul>
);

const Sobre: React.FC = () => (
  <>
    <section>
      <h2>O que é o Marcador de Pontos</h2>
      <p>
        O Marcador de Pontos é uma ferramenta gratuita para anotar o placar de jogos de baralho sem papel e caneta.
        Hoje o site oferece marcadores de Truco, Cacheta e Canastra, além de um marcador livre para duas equipes,
        que serve para qualquer jogo ou esporte.
      </p>
      <p>
        Tudo funciona direto no navegador, sem cadastro. O placar fica salvo no próprio aparelho, então dá para
        fechar a página e continuar a partida depois.
      </p>
    </section>
    <section>
      <h2>O que você encontra aqui</h2>
      <ul>
        <li><strong>Marcador de Truco:</strong> placar de Nós x Eles com pontos de 1, 3, 6, 9 e 12.</li>
        <li><strong>Marcador de Cacheta:</strong> vários jogadores, pontuação inicial configurável e controle de quem dá as cartas.</li>
        <li><strong>Marcador de Canastra:</strong> dois times, regras personalizáveis e histórico editável.</li>
        <li><strong>Marcador livre:</strong> Equipe A x Equipe B com nomes editáveis.</li>
        <li><strong>Guias de como jogar:</strong> regras e dicas de Truco e de Cacheta para quem está começando.</li>
      </ul>
    </section>
    <section>
      <h2>Aplicativo para Android</h2>
      <p>
        Também existe o aplicativo Marcador de Pontos para Android, que funciona sem internet e mantém a tela ligada
        durante a partida. Ele está disponível na{' '}
        <LinkExterno href={PLAY_STORE_URL}>Google Play Store</LinkExterno>.
      </p>
    </section>
    <section>
      <h2>Quem faz</h2>
      <p>
        O projeto é desenvolvido e mantido por André Luis Sehnem, desenvolvedor de software brasileiro. O site e o
        aplicativo são mantidos com a exibição de anúncios.
      </p>
      <CanalDeContato />
    </section>
  </>
);

const Privacidade: React.FC = () => (
  <>
    <p className="institucional-data">Última atualização: {ULTIMA_ATUALIZACAO}</p>
    <section>
      <h2>Resumo</h2>
      <p>
        O Marcador de Pontos não exige cadastro e não pede nome, e-mail ou telefone para ser usado. Esta política
        explica quais dados são tratados quando você acessa marcadordepontos.com.br.
      </p>
    </section>
    <section>
      <h2>Dados salvos no seu aparelho</h2>
      <p>
        Os placares, os nomes de jogadores e equipes e a preferência de tema ficam gravados apenas no armazenamento
        local do seu navegador (localStorage). Essas informações não são enviadas para os nossos servidores e podem
        ser apagadas a qualquer momento limpando os dados do site no navegador.
      </p>
    </section>
    <section>
      <h2>Dados de navegação e estatísticas</h2>
      <p>
        Usamos o Google Analytics e o Vercel Analytics para entender como o site é usado. Essas ferramentas registram
        dados como páginas visitadas, tempo de permanência, tipo de aparelho, navegador, país ou cidade aproximada e
        a origem do acesso. O Google Analytics usa cookies para diferenciar visitantes. Esses dados são usados de
        forma agregada, para melhorar o site.
      </p>
    </section>
    <section>
      <h2>Publicidade</h2>
      <p>
        O site pode exibir anúncios do Google AdSense. O Google e seus parceiros usam cookies para veicular anúncios
        com base nas suas visitas a este e a outros sites. Você pode desativar a publicidade personalizada nas{' '}
        <LinkExterno href="https://adssettings.google.com">Configurações de anúncios do Google</LinkExterno> e
        saber mais sobre o uso de dados em{' '}
        <LinkExterno href="https://policies.google.com/technologies/partner-sites">
          Como o Google usa informações de sites que usam os serviços dele
        </LinkExterno>.
      </p>
    </section>
    <section>
      <h2>Cookies</h2>
      <p>
        Os cookies deste site vêm das ferramentas de estatística e de publicidade citadas acima. Você pode bloquear
        ou apagar cookies nas configurações do navegador. Os marcadores continuam funcionando sem eles.
      </p>
    </section>
    <section>
      <h2>Compartilhamento</h2>
      <p>
        Não vendemos dados pessoais. Os dados de navegação são tratados pelos fornecedores citados nesta política
        (Google e Vercel), conforme as políticas de privacidade de cada um.
      </p>
    </section>
    <section>
      <h2>Seus direitos</h2>
      <p>
        Pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode pedir confirmação, acesso, correção ou
        exclusão de dados pessoais. Para isso, use os canais abaixo.
      </p>
      <CanalDeContato />
    </section>
    <section>
      <h2>Crianças</h2>
      <p>O site não é direcionado a crianças e não coleta intencionalmente dados pessoais de menores.</p>
    </section>
    <section>
      <h2>Alterações</h2>
      <p>
        Esta política pode ser atualizada. A data no topo da página indica a versão em vigor.
      </p>
    </section>
  </>
);

const Contato: React.FC = () => (
  <>
    <section>
      <h2>Fale com a gente</h2>
      <p>
        Encontrou um erro, tem uma sugestão de jogo ou quer tirar uma dúvida sobre o site ou o aplicativo? Use um
        dos canais abaixo.
      </p>
      <CanalDeContato />
    </section>
    <section>
      <h2>Sugestões e problemas</h2>
      <p>
        Ao relatar um problema, informe o jogo que estava usando, o aparelho e o navegador. Isso ajuda a reproduzir
        e corrigir mais rápido. Sugestões de novos jogos e de regras regionais são bem-vindas.
      </p>
    </section>
    <section>
      <h2>Avaliações do aplicativo</h2>
      <p>
        Se você usa o app para Android, também pode deixar sua avaliação ou comentário na{' '}
        <LinkExterno href={PLAY_STORE_URL}>página do app na Play Store</LinkExterno>.
      </p>
    </section>
  </>
);

const NaoEncontrada: React.FC = () => (
  <section>
    <p>O endereço que você abriu não existe ou foi alterado. Veja por onde continuar:</p>
    <ul>
      <li><a href="/">Página inicial</a></li>
      <li><a href="/listajogos">Lista de jogos e marcadores</a></li>
      <li><a href="/como-jogar-truco">Como jogar Truco</a></li>
      <li><a href="/como-jogar-cacheta">Como jogar Cacheta</a></li>
    </ul>
  </section>
);

const TITULOS: Record<PaginaInstitucional, string> = {
  'nao-encontrada': 'Página não encontrada',
  sobre: 'Sobre o Marcador de Pontos',
  'politica-de-privacidade': 'Política de Privacidade',
  contato: 'Contato',
};

const Institucional: React.FC<InstitucionalProps> = ({ pagina, onBack }) => {
  const themeStyles = useThemeStyles();

  return (
    <div
      className="institucional-container"
      style={{ backgroundColor: themeStyles.containerBg, color: themeStyles.textPrimary }}
    >
      <div className="institucional-header">
        <button
          className="institucional-back-btn"
          onClick={onBack}
          style={{ color: themeStyles.textPrimary, borderColor: themeStyles.buttonSecondary.border }}
          aria-label="Voltar"
        >
          <ArrowLeft size={22} />
          Voltar
        </button>
        <ThemeToggle />
      </div>

      <main className="institucional-content">
        <h1 className="institucional-title">{TITULOS[pagina]}</h1>
        {pagina === 'sobre' && <Sobre />}
        {pagina === 'politica-de-privacidade' && <Privacidade />}
        {pagina === 'contato' && <Contato />}
        {pagina === 'nao-encontrada' && <NaoEncontrada />}
      </main>
    </div>
  );
};

export default Institucional;
