const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
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
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/listajogos', changefreq: 'weekly', priority: '0.9' },
  { path: '/truco', changefreq: 'weekly', priority: '0.8' },
  { path: '/como-jogar-truco', changefreq: 'monthly', priority: '0.7' },
  { path: '/cacheta', changefreq: 'weekly', priority: '0.8' },
  { path: '/como-jogar-cacheta', changefreq: 'monthly', priority: '0.7' },
];

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

console.log(`✅ sitemap.xml e robots.txt gerados em dist/ (base: ${baseUrl})`);
