@echo off


COPY gifts.json gifts.json.bak

where git > nul 2>&1 && (
    IF EXIST .git (
        call git add .
        call git commit -m "Migration"
        call git stash
        call git pull origin master --allow-unrelated-histories 
        call git stash clear
    ) ELSE (
        echo "Git not found, you can manually download the latest version from https://github.com/AthallahDzaki/Trilogy-Node-Script/releases"
    )    
)

echo "Migrate" > migrate.txt

COPY gifts.json.bak gifts.json