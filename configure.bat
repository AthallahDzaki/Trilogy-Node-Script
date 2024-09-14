@echo off

if NOT EXIST config.json (
    COPY config.json.ex config.json
)

set /p PORT=Enter the chaos port number (Leave blank for default 42069): 

if "%PORT%"=="" goto duration

call node configure.js --port %PORT%

:cooldown

set /p COOLDOWN=Enter the chaos cooldown (Leave blank for default 30000 in ms): 

if "%COOLDOWN%"=="" goto duration

call node configure.js --effect-cooldown %COOLDOWN%

:duration

set /p DURATION=Enter the chaos duration (Leave blank for default 30000 in ms): 

if "%DURATION%"=="" goto rapidfire

call node configure.js --effect-duration %DURATION%

:rapidfire

set /p RAPIDFIRE=Enable rapid fire? (y/n): 

if "%RAPIDFIRE%"=="n" (
    call node configure.js --disable-rapidfire
    goto enable-tiktok
)

call node configure.js --enable-rapidfire

:rapidfire-duration

set /p RAPIDFIREDURATION=Enter the rapid fire duration (Leave blank for default 15000 in ms):

if "%RAPIDFIREDURATION%"=="" goto enable-tiktok

call node configure.js --rapidfire-effect-duration %RAPIDFIREDURATION%

:enable-tiktok

set /p TIKTOK=Enable Tiktok? (y/n):

if "%TIKTOK%"=="n" (
    call node configure.js --disable-tiktok
    goto done
)

call node configure.js --enable-tiktok

set /p ENABLETIKFINITY=Enable Tiktok Interactive? (y/n):

if "%ENABLETIKFINITY%"=="n" (
    call node configure.js --disable-tikfinity
    goto tiktok-username
)

call node configure.js --enable-tikfinity

set /p ENABLETIKFINITYHTTP=Enable Tikfinity HTTP Server? (y/n): 

if "%ENABLETIKFINITYHTTP%"=="n" (
    call node configure.js --disable-http-api
    goto use-buildin-chaos
)

call node configure.js --enable-http-api

:use-buildin-chaos

set /p USEBUILDINCHAOS=Use build-in chaos? (y/n):

if "%USEBUILDINCHAOS%"=="n" (
    call node configure.js --disable-tiktok-use-buildint-chaos
    goto qo
)

call node configure.js --tiktok-use-buildint-chaos

:qo

if "%ENABLETIKFINITY%"=="y" goto enable-vote

:tiktok-username

set /p TIKTOKUSERNAME=Enter your Tiktok username:

call node configure.js --tiktok-username %TIKTOKUSERNAME%

:enable-vote

set /p ENABLEVOTE=Enable vote? (y/n):

if "%ENABLEVOTE%"=="n" (
    call node configure.js --disable-vote
    goto force-effect
)

call node configure.js --enable-vote

set /p VOTECOOLDOWN=Enter the vote cooldown (Leave blank for default 30000 in ms):

if "%VOTECOOLDOWN%"=="" goto force-effect

call node configure.js --vote-cooldown %VOTECOOLDOWN%

:force-effect

set /p FORCEEFFECT=Force effect? (y/n):

if "%FORCEEFFECT%"=="n" (
    call node configure.js --disable-force-effect
    goto done
)

call node configure.js --enable-force-effect

if %ENABLETIKFINITY%=="n" (    
    set /p SESSIONID=Enter your Tiktok session ID:

    call node configure.js --tiktok-sessionid %SESSIONID%
)

:indofinity

set /p ENABLEINDOFINITY=Enable Indofinity? (y/n):

if "%ENABLEINDOFINITY%"=="n" (
    call node configure.js --disable-indofinity
    goto done
)

call node configure.js --enable-indofinity

:done

echo Configuration completed. You can now start the chaos by running start.bat
