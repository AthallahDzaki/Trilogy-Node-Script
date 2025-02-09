@echo off


COPY gifts.json gifts.json.bak
COPY spinwheel-effects.json spinwheel-effects.json.bak

where git > nul 2>&1 && (
    IF EXIST .git (
        call git fetch
        call git reset --hard origin/master
    ) ELSE (
        echo "Git not found, you can manually download the latest version from https://github.com/AthallahDzaki/Trilogy-Node-Script/releases"
    )    
)

echo DONE > migrate.txt

COPY gifts.json.bak gifts.json
COPY spinwheel-effects.json.bak spinwheel-effects.json