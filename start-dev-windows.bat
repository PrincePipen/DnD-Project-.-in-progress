@echo off
echo Starting AI D&D Game development environment...

REM Clear any existing process on port 3001 (Windows only)
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :3001') DO (
  taskkill /F /PID %%P 2>NUL
)

REM Start the backend server in a new window with proper title
start "AI D&D Server" cmd /k "cd %~dp0 && echo [SERVER WINDOW] Starting backend server... && npm run server"

REM Wait longer for backend to initialize
echo Waiting for backend server to start (10 seconds)...
timeout /t 10

REM Start the frontend server
cd %~dp0 && echo Starting frontend... && npm run client
