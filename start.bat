@echo off

where git > nul 2>&1 || (
    call git pull
) else (
    echo "Git not found, you can manually download the latest version from https://github.com/AthallahDzaki/Trilogy-Node-Script/releases"
)

IF NOT EXIST node_modules (
    call npm install
)

if NOT EXIST config.json (
    REN config.json.ex config.json
)

call node index.js
pause