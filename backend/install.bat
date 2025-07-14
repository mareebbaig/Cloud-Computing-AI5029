@echo off
echo Installing dependencies...
npm install
echo.
echo Dependencies installed successfully!
echo.
echo Make sure DynamoDB Local is running on port 8000 before starting the app.
echo.
echo To start the application, run:
echo   npm start
echo.
echo For development mode with auto-restart:
echo   npm run dev
pause
