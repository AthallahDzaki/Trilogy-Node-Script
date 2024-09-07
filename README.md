<h1 align="center">
  GTA SA Chaos Mod with Tiktok Integration
</h1>

FOR BEST PERFORMANCE, USE [My Port Chaos Mod](https://github.com/AthallahDzaki/Trilogy-ASI-Script/releases)

There is 2 Mode, Memory and Normal. if You prefer use Memory mode change to branch [memory](https://github.com/AthallahDzaki/Trilogy-Node-Script/tree/king)

The only difference is in the game memory checking system so that it does not send packets when in the initial menu.

## Getting Started (Normal Mode)

1. Prerequire
- Tikfinity (Recommended)
  
2. Run 
```
double click on start.bat
```

## Configuration
```
{
    "General": { // General Configuration
        "GUIWebsocketPort": 42069, // Port for Websocket
        "Cooldown": 30000, // Cooldown for Effect
        "EffectDuration": 30000, // Duration for Effect
        "Seed": "" // Seed for Random Effect
    },

    "RapidFire" :{ // Rapid Fire Configuration
        "RapidFireEnable": true, // Enable Rapid Fire
        "RapidFireEffectDuration" : 15000  // Duration for Rapid Fire
    },

    "Tiktok": {
        "TiktokEnable": true, // Enable Tiktok
        "TikfinityEnable": true, // Enable Tikfinity
        "TikfinityHTTPServer": false, // Enable HTTP Server for Tikfinity
        "TiktokUseBuiltInChaos" : false, // Use Built In Timer
        "TiktokUsername": "@tiktok", // Tiktok Username (for non tikfinity)
        "TiktokVoteEnable": true, // Enable Vote
        "TiktokVoteCooldown" : 30000, // Cooldown for Vote
        "TiktokForceEffect": true, // Force Effect
        "TiktokSessionId" : "" // Session ID (for non tikfinity)
    },

    "EffectForceEffect" : { // Force Specific Effect
        "ForceSpecificEffect" : false, // Force Specific Effect
        "EffectName" : "spawn_ultra_crazy_hobo" // Effect Name
    },

    "EffectForceCategory": { // Force Specific Category
        "ForceSpecificCategory": false, // Force Specific Category
        "CategoryName": "" // Category Name
    },

    "Memory": { // Unused
        "EnableMemoryCheck": true // Enable Memory Check
    },

    "Debug": { // Unused
        "MemoryDebug": false // Enable Memory Debug
    }
}

```

Note: (Only for Non Tikfinity)
To get the Session ID from your account, open TikTok in your web browser and make sure you are logged in, then press F12 to open the developer tools. Switch to the Application tab and select Cookies on the left side. Then take the value of the cookie with the name sessionid.
