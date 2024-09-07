@echo off

SET GIT_FOUND=0

where git > nul 2>&1 && (
    IF EXIST .git (
        SET GIT_FOUND=1
        call git pull
    ) ELSE (
        SET GIT_FOUND=1
        call git init
        call git remote add origin https://github.com/AthallahDzaki/Trilogy-Node-Script
        call git pull
    )
)
IF GIT_FOUND==0 (
    echo "Git not found, you can manually download the latest version from https://github.com/AthallahDzaki/Trilogy-Node-Script/releases"
)

call npm install

if NOT EXIST config.json (
    REN config.json.ex config.json
)

call node index.js
pause