@echo off

SET GIT_FOUND=0

where git > nul 2>&1 && (
    IF EXIST .git (
        SET GIT_FOUND=1
        call git pull origin master
    ) ELSE (
        SET GIT_FOUND=1
        call git init
        call git remote add origin https://github.com/AthallahDzaki/Trilogy-Node-Script
        call git pull origin master --allow-unrelated-histories 
    )
    SET OX0 = 0
    IF NOT EXIST migrated.txt (
        call migrate
    )
)

IF GIT_FOUND==0 (
    echo "Git not found, you can manually download the latest version from https://github.com/AthallahDzaki/Trilogy-Node-Script/releases"
)

call npm install

SET NEED_CONFIG=0

if NOT EXIST config.json (
    COPY config.json.ex config.json
    SET NEED_CONFIG=1
)

IF NEED_CONFIG==1 (
    echo "New user? Please edit config.json file"
    echo "If you use Tiktok Interactive, set TiktokEnable to true, TikfinityEnable to true and TiktokForceEffect to true."
    echo "If you want use Action, set TiktokEnable to true, TikfinityEnable to true, and TikfinityHTTPServer to true."
    echo "If you use Indofinity, set TiktokUseIndofinity to true."
    pause
    exit
)
call node index.js
pause