@echo off

# First Copy gifts.json to another directory

COPY gifts.json gifts.json.bak

where git > nul 2>&1 && (
    IF EXIST .git (
        call git stash
        call git pull origin normal
    ) ELSE (
        echo "Git not found, you can manually download the latest version from https://github.com/AthallahDzaki/Trilogy-Node-Script/releases"
    )    
)

# Then restore gifts.json

COPY gifts.json.bak gifts.json