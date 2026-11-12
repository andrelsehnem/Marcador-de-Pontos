// Renderiza as páginas web para HTML durante o build (usado por generate-seo-files.js).
// Roda o App.web.tsx no Node, sem navegador, usando o Babel que o Expo já traz.
const path = require('path');
const Module = require('module');
const { PassThrough } = require('stream');

const srcDir = path.join(__dirname, '../src');
let prepared = false;

function createStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    clear: () => data.clear(),
  };
}

function prepare() {
  if (prepared) {
    return;
  }
  prepared = true;

  process.env.NODE_ENV = 'production';
  process.env.BABEL_ENV = 'production';

  // Os marcadores leem o placar salvo ao montar; no build o armazenamento começa vazio.
  for (const name of ['localStorage', 'sessionStorage']) {
    Object.defineProperty(globalThis, name, { value: createStorage(), configurable: true, writable: true });
  }

  // No web, `react-native` é o `react-native-web`.
  const resolveFilename = Module._resolveFilename;
  Module._resolveFilename = function (request, ...rest) {
    return resolveFilename.call(this, request === 'react-native' ? 'react-native-web' : request, ...rest);
  };

  // Compila os .ts/.tsx do projeto na hora, com a mesma configuração do babel.config.js.
  const babel = require('@babel/core');
  const compile = (module, filename) => {
    const { code } = babel.transformFileSync(filename, { cwd: path.join(__dirname, '..'), sourceMaps: false });
    // O Babel mantém `import()` (usado no lazy); no Node ele precisa passar pelo require deste hook.
    const lazyImport = 'const __lazyImport = (id) => Promise.resolve().then(() => require(id));\n';
    module._compile(lazyImport + code.replace(/\bimport\(/g, '__lazyImport('), filename);
  };
  require.extensions['.ts'] = compile;
  require.extensions['.tsx'] = compile;

  // CSS é entregue pelos <link> do HTML; aqui o import é ignorado. Fica registrado depois de
  // .ts/.tsx para que `./Footer` resolva para Footer.tsx, e não para Footer.css.
  require.extensions['.css'] = () => {};
}

/** Devolve o HTML da página (`landing`, `truco`, `sobre`...) pronto para entrar em #root. */
function renderPage(page) {
  prepare();

  const React = require('react');
  const { renderToPipeableStream } = require('react-dom/server');
  const App = require(path.join(srcDir, 'App.web.tsx')).default;

  return new Promise((resolve, reject) => {
    const chunks = [];
    const output = new PassThrough();
    output.on('data', (chunk) => chunks.push(chunk));
    output.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    output.on('error', reject);

    const stream = renderToPipeableStream(React.createElement(App, { initialPage: page }), {
      // Espera as páginas carregadas com lazy() antes de emitir o HTML.
      onAllReady: () => stream.pipe(output),
      onShellError: reject,
      onError: reject,
    });
  });
}

module.exports = { renderPage };
