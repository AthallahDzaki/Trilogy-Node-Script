import fs from "fs";

let argv = process.argv;

(async () => {
    switch(argv[2]) {
        case "--port" :{
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.General.WebSocketGUIPort = argv[3];
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Port Changed to " + argv[3]);
            break;
        }
        case "--effect-cooldown" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.General.Cooldown = argv[3];
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Cooldown Changed to " + argv[3]);
            break;
        }
        case "--effect-duration" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.General.EffectDuration = argv[3];
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Effect Duration Changed to " + argv[3]);
            break;
        }
        case "--enable-rapidfire" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.General.RapidFireEnabled = true;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("RapidFire Enabled");
            break;
        }
        case "--disable-rapidfire" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.General.RapidFireEnabled = false;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("RapidFire Disabled");
            break;
        }
        case "--rapidfire-effect-duration" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.General.RapidFire.RapidFireEffectDuration = argv[3];
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Effect Duration Changed to " + argv[3]);
            break;
        }
        case "--enable-tiktok" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TiktokEnabled = true;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("TikTok Enabled");
            break;
        }
        case "--disable-tiktok" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TiktokEnable = false;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("TikTok Disabled");
            break;
        }
        case "--enable-tikfinity" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TikfinityEnable = false;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Tikfinity Enabled");
            break;
        }
        case "--disable-tikfinity" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TikfinityEnable = false;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Tikfinity Disabled");
            break;
        }
        case "--enable-http-api" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TikfinityHTTPServer = true;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("API Enabled");
            break;
        }
        case "--disable-http-api" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TikfinityHTTPServer = false;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("API Disabled");
            break;
        }
        case "--tiktok-use-buildint-chaos" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TiktokUseBuiltInChaos = true;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("BuildInChaos Enabled");
            break;
        }
        case "--disable-tiktok-use-buildint-chaos" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TiktokUseBuiltInChaos = false;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("BuildInChaos Disabled");
            break;
        }
        case "--tiktok-username" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TikTokUsername = argv[3];
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Username Changed to " + argv[3]);
            break;
        }
        case "--enable-vote" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TikTokVoteEnabled = true;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Vote Enabled");
            break;
        }
        case "--disable-vote" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TikTokVoteEnabled = false;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Vote Disabled");
            break;
        }
        case "--tiktok-vote-cooldown" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TikTokVoteCooldown = argv[3];
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Vote Cooldown Changed to " + argv[3]);
            break;
        }
        case "--enable-force-effect" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TiktokForceEffect = true;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Force Effect Enabled");
            break;
        }
        case "--disable-force-effect" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TiktokForceEffect = false;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Force Effect Disabled");
            break;
        }
        case "--tiktok-sessionid" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TiktokSessionId = argv[3];
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("SessionID Changed to " + argv[3]);
            break;
        }
        case "--enable-indofinity" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TiktokUseIndofinity = true;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Indofinity Enabled");
            break;
        }
        case "--disable-indofinity" : {
            let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            config.Tiktok.TiktokUseIndofinity = false;
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4), "utf8");
            console.log("Indofinity Disabled");
            break;
        }
    }
})();