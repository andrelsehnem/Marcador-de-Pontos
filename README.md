# Marcador de Pontos

App em React Native + Expo (com suporte Web) para marcação de pontos em jogos de baralho e no geral.

## Build Android para Play Store (AAB)

### 1) Pré-requisitos
- Node.js instalado.
- Dependências instaladas: `npm install`.
- Java 17 e Android SDK configurados no computador.
- Keystore de upload disponível.

### 2) Preparar versão de release

Antes de gerar um novo build para loja:

1. Atualize a versão Android nativa em `android/app/build.gradle`:
   - `versionCode` (inteiro, sempre maior que o anterior)
   - `versionName` (texto visível para o usuário)
   - Exemplo:
     - `versionCode 8`
     - `versionName "2.0.5"`

2. Mantenha `expo.version` em `app.json` no mesmo número do `versionName`.

3. (Opcional, recomendado) mantenha `package.json` com a mesma versão.

### 3) Gerar o arquivo da Play Store (AAB)

Comando já pronto no projeto:

```bash
npm run build:android:store
```

Esse comando executa:

```bash
cd android && gradlew.bat bundleRelease
```

Ao final, o arquivo fica em:

`android/app/build/outputs/bundle/release/app-release.aab`

### 4) Enviar para Play Console

- Faça upload do `app-release.aab` no Google Play Console (faixa de teste/produção).

## Fluxo rápido (resumo)

1. Alterar `versionCode` e `versionName` em `android/app/build.gradle`.
2. Alinhar `expo.version` em `app.json`.
2. Rodar `npm run build:android:store`.
3. Publicar o `.aab` no Play Console.

## Observações

- Para desenvolvimento Android local (APK/debug), use:

```bash
npm run android
```
