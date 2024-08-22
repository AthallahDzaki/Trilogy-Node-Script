<h1 align="center">
  GTA SA Chaos Mod with Tiktok Integration
</h1>

FOR BEST PERFORMANCE, USE [My Port Chaos Mod](https://github.com/AthallahDzaki/Trilogy-ASI-Script/releases)

There is 2 Mode, Memory and Normal. if You prefer use Memory mode change to branch [memory](https://github.com/AthallahDzaki/Trilogy-Node-Script/tree/king)

The only difference is in the game memory checking system so that it does not send packets when in the initial menu.

## Getting Started (Normal Mode)

1. Prerequire
- None
  
2. Install
```
npm i
```
3. Rename config.json.ex to config.json

4. Modify config.json
*Tiktok Configuration will added in bottom section*

5. Start Your GTA SA Until Game Fully Loaded

6. Run
```
node index.js
```

## Configuration
```
{
    "General": { // General Config (Relate to Chaos Mod Config)
        "GUIWebsocketPort": 42069,
        "Cooldown": 30000,
        "EffectDuration": 30000,
        "Seed": ""
    },

    "RapidFire" :{ // Rapid Fire
        "RapidFireEnable": true, 
        "RapidFireEffectDuration" : 15000 // Duration for All Effect from rapid fire
    },

    "Tiktok": {
        "TiktokEnable": true, // Enable Tiktok
        "Tikfinity": false, // Integrate with Tikfinity (Tiktok Username can be empty)
        "TiktokUsername": "@tiktok", // Tiktok Live Username
        "TiktokVoteEnable": true, // Enable Vote
        "TiktokVoteCooldown" : 30000, // Vote Cooldown (After Vote)
        "TiktokForceEffect": false, // Force Effect, Effect can be specific at gifts.json
        "TiktokSessionId" : "" // See Bottom Note! (Unused when Tikfinity enable)
    },

    "EffectForceEffect" : {
        "ForceSpecificEffect" : false, // Force Specific Effect to Run
        "EffectName" : "spawn_ultra_crazy_hobo" // Spawn Ultra Crazy Hobo
    },

    "EffectForceCategory": {
        "ForceSpecificCategory": false, // Force Specific Effect from choosen category
        "CategoryName": "" // ...
    },

    "Memory": {
        "EnableMemoryCheck": true // Memory Check, available for Memory branch (Memory Mode)
    },

    "Debug": {
        "MemoryDebug": false // Debugging (Dev Only)
    }
}
```

Note: (Only for Non Tikfinity)
To get the Session ID from your account, open TikTok in your web browser and make sure you are logged in, then press F12 to open the developer tools. Switch to the Application tab and select Cookies on the left side. Then take the value of the cookie with the name sessionid.
