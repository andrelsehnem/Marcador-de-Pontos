const fs = require('fs');
const path = require('path');

const distIndexPath = path.join(__dirname, '../dist/index.html');

if (fs.existsSync(distIndexPath)) {
  let html = fs.readFileSync(distIndexPath, 'utf8');
  
  const adsenseScript = `
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7478664676745892"
     crossorigin="anonymous"></script>
    `;
  
  // Injeta o script antes do </head>
  if (!html.includes('adsbygoogle')) {
    html = html.replace('</head>', `${adsenseScript}\n</head>`);
    fs.writeFileSync(distIndexPath, html);
    console.log('✅ Script do AdSense adicionado ao dist/index.html');
  } else {
    console.log('✅ Script do AdSense já existe no dist/index.html');
  }
} else {
  console.log('❌ Arquivo dist/index.html não encontrado');
}
