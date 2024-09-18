@echo off

SET GIT_FOUND=0

where node > nul 2>&1 || (
    NET SESSION >nul 2>&1
    IF %ERRORLEVEL% EQU 0 (
        powershell -Command "Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -File D:/MyGithub/Trilogy-Node-Script/nodejs.ps1' -Verb RunAs"
    ) ELSE (
        echo "You don't have NodeJS Please run the script as administrator"
        pause
    )
)

IF EXIST OM0.txt ( 
    echo "Found 0M0, Ignore Auto Updater"
    goto OM0 
)

where git > nul 2>&1 && (
    IF EXIST .git (
        SET GIT_FOUND=1
        call migrate
    ) ELSE (
        SET GIT_FOUND=1
        call git init
        call git remote add origin https://github.com/AthallahDzaki/Trilogy-Node-Script
        call git pull origin master --allow-unrelated-histories 
    )
    IF NOT EXIST migrate.txt (
        call migrate
    )
)

IF %GIT_FOUND%==0 (
    echo "Git not found, you can manually download the latest version from https://github.com/AthallahDzaki/Trilogy-Node-Script/releases"
)

:OM0

call npm install

SET NEED_CONFIG=0

if NOT EXIST config.json (
    COPY config.json.ex config.json
    SET NEED_CONFIG=1
)

IF %NEED_CONFIG%==1 (
    call start-web
    pause
    goto skip
)
call node index.js
pause
:skip