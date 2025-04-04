@echo off
setlocal EnableDelayedExpansion

:: Setup paths and variables
set "LOG_DIR=logs"
set "LOG_FILE=%LOG_DIR%\test-run-%date:~-4,4%%date:~-10,2%%date:~-7,2%.log"
set "ERROR_COUNT=0"

:: Create logs directory if it doesn't exist
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

:: Logging function
:log
echo [%date% %time%] %~1 >> "%LOG_FILE%"
echo %~1
goto :eof

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    call :log "ERROR: Node.js is not installed"
    set /a ERROR_COUNT+=1
    goto :error
)

:: Check if pnpm is installed
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    call :log "ERROR: pnpm is not installed"
    set /a ERROR_COUNT+=1
    goto :error
)

:: Check if package.json exists
if not exist "package.json" (
    call :log "ERROR: package.json not found"
    set /a ERROR_COUNT+=1
    goto :error
)

:: Install/update dependencies
call :log "Installing dependencies..."
pnpm install
if %errorlevel% neq 0 (
    call :log "ERROR: Failed to install dependencies"
    set /a ERROR_COUNT+=1
    goto :error
)

:: Install Playwright browsers
call :log "Installing Playwright browsers..."
pnpm playwright install chromium
if %errorlevel% neq 0 (
    call :log "ERROR: Failed to install browsers"
    set /a ERROR_COUNT+=1
    goto :error
)

:: Run tests
call :log "Running tests..."
pnpm playwright test
if %errorlevel% neq 0 (
    call :log "ERROR: Tests failed"
    set /a ERROR_COUNT+=1
    goto :error
)

:: Check if reports exist
if not exist "%LOG_DIR%\test-report.json" (
    call :log "ERROR: Test report was not created"
    set /a ERROR_COUNT+=1
    goto :error
)

call :log "Tests completed successfully"
goto :end

:error
call :log "Exiting with errors (error count: %ERROR_COUNT%)"
exit /b 1

:end
call :log "Exiting"
exit /b 0
