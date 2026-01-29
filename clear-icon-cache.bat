@echo off
echo Clearing Windows icon cache...
taskkill /F /IM explorer.exe
timeout /T 2 /NOBREAK >nul
del /A /Q "%localappdata%\IconCache.db"
del /A /F /Q "%localappdata%\Microsoft\Windows\Explorer\iconcache*"
echo Starting explorer...
start explorer.exe
echo Done! Icon cache cleared.
pause
