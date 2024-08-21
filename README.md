<h1 align="center">
  GTA SA Chaos Mod with Tiktok Integration
</h1>

FOR BEST PERFORMANCE, USE [My Port Chaos Mod](https://github.com/AthallahDzaki/Trilogy-ASI-Script/releases)

There is 2 Mode, Memory and Normal. if You prefer use Normal mode change to branch [normal](https://github.com/AthallahDzaki/Trilogy-Node-Script/tree/normal)

The only difference is in the game memory checking system so that it does not send packets when in the initial menu.

## Getting Started (Memory Mode)

1. Prerequire
- [Node GYP](https://github.com/nodejs/node-gyp)
- [Visual Studio](https://visualstudio.microsoft.com/vs/)
  
2. Install
```
npm i
cd node_modules/memoryjs/
npm run build32
```

3. Modify config.json
Tiktok Configuration will added in bottom section

4. Run
```
node index.js
```

5. NodeJS will detect your game state and send Websocket if Game Loaded Properly

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
        "TiktokSessionId" : "" // See Bottom Note!
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
        "EnableMemoryCheck": true // Memory Check, available for King branch (Memory Mode)
    },

    "Debug": {
        "MemoryDebug": false // Debugging (Dev Only)
    }
}
```

To get the Session ID from your account, open TikTok in your web browser and make sure you are logged in, then press F12 to open the developer tools. Switch to the Application tab and select Cookies on the left side. Then take the value of the cookie with the name sessionid.
