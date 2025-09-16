@echo off
echo Starting both servers...
echo.

echo Starting Backend (Next.js) on http://localhost:3000...
start "Backend" cmd /k "cd /d "%~dp0summarit" && npm run dev"

echo Starting Frontend (Vite) on http://localhost:5173...
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
