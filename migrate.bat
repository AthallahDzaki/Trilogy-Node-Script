@echo off

where git > nul 2>&1 && (
    IF EXIST .git (
        call git fetch
        call git pull
        call git reset --hard origin/master
    ) ELSE (
        echo Thanks For Use this Project :)
    )    
)
