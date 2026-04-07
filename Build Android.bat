@echo off
setlocal

echo ==========================================
echo Atualizador de versao Android (Expo + RN)
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERRO: Node.js nao encontrado no PATH.
  exit /b 1
)

node scripts\update-android-version.js
if errorlevel 1 (
  echo.
  echo Falha ao atualizar versoes.
  exit /b 1
)

echo.
echo Versoes atualizadas com sucesso.

echo.
echo Iniciando build Android para Play Store...
npm run build:android:store
if errorlevel 1 (
  echo.
  echo Falha ao executar build:android:store.
  exit /b 1
)

echo.
echo Build concluido com sucesso.

set "AAB_DIR=%~dp0android\app\build\outputs\bundle\release"
if exist "%AAB_DIR%" (
  echo Abrindo pasta do AAB: %AAB_DIR%
  start "" "%AAB_DIR%"
) else (
  echo Pasta do AAB nao encontrada: %AAB_DIR%
)

endlocal
