@echo off

set GIT_FOUND=0

where git > nul 2>&1 || (
    set GIT_FOUND=1
    git pull
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