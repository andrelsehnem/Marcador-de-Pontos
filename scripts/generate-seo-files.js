const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const distIndexPath = path.join(distDir, 'index.html');
const distCssDir = path.join(distDir, '_expo/static/css');
const DEFAULT_SITE_URL = 'https://marcadordepontos.com.br';

if (!fs.existsSync(distDir)) {
  console.log('❌ Pasta dist não encontrada. Rode o build antes de gerar sitemap/robots.');
  process.exit(0);
}

const rawBaseUrl =
  process.env.SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  DEFAULT_SITE_URL;

const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, '');
const baseUrl = normalizedBaseUrl.startsWith('http') ? normalizedBaseUrl : `https://${normalizedBaseUrl}`;

if (!process.env.SITE_URL && !process.env.VERCEL_PROJECT_PRODUCTION_URL && !process.env.VERCEL_URL) {
  console.log(`ℹ️ SITE_URL não definido. Usando domínio padrão: ${DEFAULT_SITE_URL}`);
}
const today = new Date().toISOString().split('T')[0];

const routes = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: '1.0',
    title: 'Marcador de Baralho: Truco e Cacheta Online',
    description: 'Marque pontos de Truco e Cacheta online, grátis e rápido. Salve partidas e jogue no celular sem instalar nada.',
  },
  {
    path: '/listajogos',
    changefreq: 'weekly',
    priority: '0.9',
    title: 'Jogos de Baralho Online | Marcador de Pontos',
    description: 'Escolha Truco ou Cacheta e acompanhe pontuação em tempo real com um marcador de baralho simples e otimizado para celular.',
  },
  {
    path: '/truco',
    changefreq: 'weekly',
    priority: '0.8',
    title: 'Marcador de Truco Online',
    description: 'Controle pontos do Truco com placar rápido, rodadas de 1, 3, 6 e 12 e salvamento local automático.',
  },
  {
    path: '/marcador',
    changefreq: 'weekly',
    priority: '0.8',
    title: 'Marcador de Pontos Livre | Equipe A e B',
    description: 'Use um marcador de pontos livre para Equipe A e B com +1 e -1, nomes editáveis e salvamento automático.',
  },
  {
    path: '/como-jogar-truco',
    changefreq: 'monthly',
    priority: '0.7',
    title: 'Como Jogar Truco | Guia Rápido para Iniciantes',
    description: 'Aprenda as regras básicas do Truco Paulista: objetivo, pontuação, truco, seis, nove e doze.',
  },
  {
    path: '/cacheta',
    changefreq: 'weekly',
    priority: '0.8',
    title: 'Marcador de Cacheta Online',
    description: 'Marque pontos da Cacheta com vários jogadores, edição de nomes e placar salvo automaticamente no navegador.',
  },
  {
    path: '/como-jogar-cacheta',
    changefreq: 'monthly',
    priority: '0.7',
    title: 'Como Jogar Cacheta | Regras e Estratégias',
    description: 'Aprenda como jogar Cacheta com regras básicas, combinações e dicas práticas para iniciantes e intermediários.',
  },
];

if (!fs.existsSync(distIndexPath)) {
  console.log('❌ Arquivo dist/index.html não encontrado. Rode o build antes de gerar páginas SEO.');
  process.exit(0);
}

const templateHtml = fs.readFileSync(distIndexPath, 'utf8');

const stylesheetHrefs = fs.existsSync(distCssDir)
  ? fs
      .readdirSync(distCssDir)
      .filter((fileName) => fileName.endsWith('.css'))
      .sort()
      .map((fileName) => `/_expo/static/css/${fileName}`)
  : [];

if (stylesheetHrefs.length === 0) {
  console.log('⚠️ Nenhum CSS encontrado em dist/_expo/static/css.');
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function upsertMetaTag(html, attr, key, content) {
  const escapedKey = escapeRegExp(key);
  const pattern = new RegExp(`<meta\\b[^>]*${attr}=["']${escapedKey}["'][^>]*>`, 'i');
  const tag = `<meta ${attr}="${key}" content="${content}">`;

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace('</head>', `    ${tag}\n</head>`);
}

function upsertCanonical(html, href) {
  const pattern = /<link\b[^>]*rel=["']canonical["'][^>]*>/i;
  const tag = `<link rel="canonical" href="${href}">`;

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace('</head>', `    ${tag}\n</head>`);
}

function ensureStylesheets(html, hrefs) {
  let updatedHtml = html;

  for (const href of hrefs) {
    const escapedHref = escapeRegExp(href);
    const linkPattern = new RegExp(`<link\\b[^>]*href=["']${escapedHref}["'][^>]*>`, 'i');

    if (!linkPattern.test(updatedHtml)) {
      updatedHtml = updatedHtml.replace('</head>', `    <link rel="stylesheet" href="${href}">\n</head>`);
    }
  }

  return updatedHtml;
}

function buildRouteHtml(route) {
  const canonicalUrl = `${baseUrl}${route.path}`;
  let html = templateHtml;

  html = ensureStylesheets(html, stylesheetHrefs);
  html = html.replace(/<title[\s\S]*?<\/title>/i, `<title>${route.title}</title>`);
  html = upsertMetaTag(html, 'name', 'description', route.description);
  html = upsertMetaTag(html, 'name', 'robots', 'index,follow');
  html = upsertMetaTag(html, 'property', 'og:title', route.title);
  html = upsertMetaTag(html, 'property', 'og:description', route.description);
  html = upsertMetaTag(html, 'property', 'og:type', 'website');
  html = upsertMetaTag(html, 'property', 'og:url', canonicalUrl);
  html = upsertCanonical(html, canonicalUrl);

  return html;
}

for (const route of routes) {
  const routeHtml = buildRouteHtml(route);

  if (route.path === '/') {
    fs.writeFileSync(path.join(distDir, 'index.html'), routeHtml, 'utf8');
    continue;
  }

  const routeDir = path.join(distDir, route.path.replace(/^\//, ''));
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml, 'utf8');
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');

const appAdsSource = path.join(__dirname, '../app-ads.txt');
const appAdsDestination = path.join(distDir, 'app-ads.txt');

if (fs.existsSync(appAdsSource)) {
  fs.copyFileSync(appAdsSource, appAdsDestination);
  console.log('✅ app-ads.txt copiado para dist/');
} else {
  console.log('⚠️ app-ads.txt não encontrado na raiz do projeto.');
}

console.log(`✅ páginas SEO, sitemap.xml e robots.txt gerados em dist/ (base: ${baseUrl})`);
