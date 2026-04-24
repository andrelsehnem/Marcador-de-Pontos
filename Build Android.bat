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

set "KEYSTORE_PATH="
if exist "%~dp0marcador.keystore" (
  set "KEYSTORE_PATH=%~dp0marcador.keystore"
) else (
  if exist "%~dp0android\upload-keystore.jks" (
    set "KEYSTORE_PATH=%~dp0android\upload-keystore.jks"
  )
)

if defined KEYSTORE_PATH (
  echo Keystore de release encontrado.
  echo Usando arquivo: %KEYSTORE_PATH%
) else (
  echo AVISO: nenhum keystore de release foi encontrado automaticamente.
  echo O build vai usar a configuracao atual do Gradle.
)

echo.
echo Iniciando build Android para Play Store...
pushd "%~dp0android"
if defined KEYSTORE_PATH (
  call gradlew.bat bundleRelease "-PMYAPP_UPLOAD_STORE_FILE=%KEYSTORE_PATH%"
) else (
  call gradlew.bat bundleRelease
)
set "BUILD_EXIT_CODE=%ERRORLEVEL%"
popd

if not "%BUILD_EXIT_CODE%"=="0" (
  echo.
  echo Falha ao executar build:android:store.
  exit /b %BUILD_EXIT_CODE%
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
