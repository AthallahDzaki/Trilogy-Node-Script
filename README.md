<h1 align="center">
  GTA SA Chaos Mod with Tiktok Integration
</h1>

FOR BEST PERFORMANCE, USE [My Port Chaos Mod](https://github.com/AthallahDzaki/Trilogy-ASI-Script/releases)

There is 2 Mode, Memory and Normal. if You prefer use Normal mode change to branch [normal](https://github.com/AthallahDzaki/Trilogy-Node-Script/tree/normal)

The only difference is in the game memory checking system so that it does not send packets when in the initial menu.

<h2>
Getting Started (Memory Mode)
</h2>

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
