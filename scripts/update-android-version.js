const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rootDir = path.resolve(__dirname, '..');
const buildGradlePath = path.join(rootDir, 'android', 'app', 'build.gradle');
const packageJsonPath = path.join(rootDir, 'package.json');
const appJsonPath = path.join(rootDir, 'app.json');

const validateVersionName = (value) => {
  if (!value || typeof value !== 'string') {
    return false;
  }

  return /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(value.trim());
};

const validateVersionCode = (value) => /^\d+$/.test(String(value));

const incrementPatchVersion = (versionName) => {
  const parts = String(versionName).trim().split('.');

  if (parts.length !== 3 || parts.some((part) => !/^\d+$/.test(part))) {
    throw new Error('Não foi possível calcular próxima versão automaticamente. Informe manualmente no formato 2.0.7');
  }

  const major = Number(parts[0]);
  const minor = Number(parts[1]);
  const patch = Number(parts[2]) + 1;

  return `${major}.${minor}.${patch}`;
};

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const writeJson = (filePath, content) => {
  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
};

const readBuildVersions = (buildGradleContent) => {
  const versionCodeMatch = buildGradleContent.match(/versionCode\s+(\d+)/);
  const versionNameMatch = buildGradleContent.match(/versionName\s+"([^"]+)"/);

  if (!versionCodeMatch || !versionNameMatch) {
    throw new Error('Não foi possível localizar versionCode/versionName em android/app/build.gradle');
  }

  return {
    versionCode: Number(versionCodeMatch[1]),
    versionName: versionNameMatch[1],
  };
};

const updateBuildGradle = (buildGradleContent, versionCode, versionName) => {
  const withCode = buildGradleContent.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`);
  return withCode.replace(/versionName\s+"[^"]+"/, `versionName "${versionName}"`);
};

const createPrompter = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (question) =>
    new Promise((resolve) => {
      rl.question(question, (answer) => resolve(answer));
    });

  return { rl, ask };
};

const run = async () => {
  const buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
  const packageJson = readJson(packageJsonPath);
  const appJson = readJson(appJsonPath);
  const current = readBuildVersions(buildGradleContent);

  console.log('Versão atual:');
  console.log(`- versionName: ${current.versionName}`);
  console.log(`- versionCode: ${current.versionCode}`);
  console.log(`- package.json: ${packageJson.version}`);
  console.log(`- app.json (expo.version): ${appJson?.expo?.version}`);
  console.log('');

  let nextVersionName;
  let nextVersionCode;
  const suggestedVersionName = incrementPatchVersion(current.versionName);
  const suggestedVersionCode = String(current.versionCode + 1);

  const { rl, ask } = createPrompter();
  try {
    const answerVersionName = (await ask(`Para qual versão vai (versionName)? (Enter para ${suggestedVersionName}): `)).trim();
    nextVersionName = answerVersionName || suggestedVersionName;
    if (!validateVersionName(nextVersionName)) {
      throw new Error('VersionName inválido. Use formato como 2.0.7');
    }

    const answerVersionCode = (await ask(`Qual será o versionCode? (Enter para ${suggestedVersionCode}): `)).trim();
    nextVersionCode = answerVersionCode || suggestedVersionCode;
  } finally {
    rl.close();
  }

  if (!validateVersionName(nextVersionName)) {
    throw new Error('VersionName inválido. Use formato como 2.0.7');
  }

  if (!nextVersionCode) {
    nextVersionCode = String(current.versionCode + 1);
  }

  if (!validateVersionCode(nextVersionCode)) {
    throw new Error('VersionCode inválido. Use apenas números inteiros positivos.');
  }

  const parsedVersionCode = Number(nextVersionCode);

  const updatedBuildGradle = updateBuildGradle(buildGradleContent, parsedVersionCode, nextVersionName);
  fs.writeFileSync(buildGradlePath, updatedBuildGradle, 'utf8');

  packageJson.version = nextVersionName;
  writeJson(packageJsonPath, packageJson);

  if (!appJson.expo) {
    appJson.expo = {};
  }
  appJson.expo.version = nextVersionName;
  writeJson(appJsonPath, appJson);

  console.log('');
  console.log('Arquivos atualizados com sucesso:');
  console.log(`- android/app/build.gradle -> versionCode ${parsedVersionCode}, versionName ${nextVersionName}`);
  console.log(`- package.json -> version ${nextVersionName}`);
  console.log(`- app.json -> expo.version ${nextVersionName}`);
};

run().catch((error) => {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
});