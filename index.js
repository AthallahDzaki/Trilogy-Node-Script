/*
SPECIAL THANKS TO FRANKENSTEIN for Beta Testing and helping me to fix the bugs!

THANKS TO :

- Frankenstein (Beta Tester)
- WDGOfficial (Beta Tester)
- DinoAndrean (Beta Tester)
- gta-chaos-mod (For The Chaos Mod)
- TikTok (Platform)
- Tikfinity (For The API)
- Indofinity (For The API)
*/

// import memoryjs from "memoryjs";
import ora from "ora";

import { WebSocketServer } from "ws";
import { Convert } from "./function/convert.js";
import { argv, exit } from "process";
import { readFileSync, writeFileSync } from "fs";
import { xoroshiro128plus } from "pure-rand";
import {
    GenerateRandom,
    GenerateSeed,
    SendTheEffect,
} from "./function/random.js";

import { RapidFire } from './function/rapidfire.js';

import { TikTok } from "./function/tiktok.js";

import { 
    sleep, 
    findRunningProcess, 
    SelectGTASA, 
    killProcess, 
    runProcessAndWaitToExit 
} from "./function/utils.js";

import { GeneralConfig } from "./shared/shared.js";
import { API } from "./function/api.js";

let wsServer = new WebSocketServer({ port: GeneralConfig.General.GUIWebsocketPort || 42069 });

let g_sVersion = "SA CHAOS V1.6.1e";
let g_Version = -1;
let g_VersionString = "";

console.log("Welcome To SA-CHAOS " + g_sVersion + " By Athallah Dzaki");

let userSeed, rngInstance, rapidFireHandler, TiktokHandler;

async function StartServer() {
    console.log("Starting Server...");
    if (argv[2] == "--convert") {
        console.log("Converting...");
        let _convertData = await Convert(readFileSync("./effects.txt", "utf8"));
        if (_convertData != "Error") {
            writeFileSync(
                "./effects.json",
                JSON.stringify(_convertData, null, 4),
                "utf8"
            );
            console.log("Converted Successfully!");
        } else console.log("Failed to convert!");
        exit(); // Exit the process
    } else if (argv[2] == "--check") {
        let effect = JSON.parse(readFileSync("./effects.json", "utf8"))["Function"];
        console.log("Checking effects...");
        effect.forEach((element) => {
            if (typeof (element.category) == "undefined") {
                console.log("Error: Category is not defined! for " + element.name);
            }
            if (typeof (element.name) == "undefined") {
                console.log("Error: Effect is not defined! for " + element.name);
            }

            if (typeof (element.description) == "undefined") {
                console.log("Error: Description is not defined! for " + element.name);
            }

            if (typeof (element.id) == "undefined") {
                console.log("Error: ID is not defined! for " + element.name);
            }

            if (typeof (element.exclusive) == "undefined") {
                console.log("Error: Exclusive is not defined! for " + element.name);
            }

            console.log("Checked Successfully!");
            exit();
        })
    }

    if(GeneralConfig.General?.GTA_PATH == "" || GeneralConfig.General?.GTA_PATH == null) {
        let gtaPath = await SelectGTASA();
        if(gtaPath == "empty") {
            GeneralConfig.General.GTA_PATH = "empty";
        }
        else {
            GeneralConfig.General.GTA_PATH = gtaPath.split("\\gta_sa.exe")[0];
        }
        writeFileSync("./config.json", JSON.stringify(GeneralConfig, null, 4));
        console.log("GTA SA Has Been set to: " + GeneralConfig.General.GTA_PATH);
    }

    let effectDataBase = readFileSync("./effects.json", "utf8");

    userSeed = GeneralConfig.General.Seed || GenerateSeed();
    rngInstance = xoroshiro128plus(userSeed, 16);

    let cooldown = GeneralConfig.General.Cooldown || 30000;
    let remaining = cooldown;

    ValidateConfig(GeneralConfig);
    if(GeneralConfig.Tiktok.TiktokEnable)
        if(GeneralConfig.Tiktok.TikfinityHTTPServer)
            new API(effectDataBase, wsServer, userSeed, rngInstance);

    let loading = ora("Waiting GTA SA to Start"),
        loadingDone = false;
    loading.spinner.interval = 100;
    loading.start();

    while (true) {
        if (!findRunningProcess("gta_sa.exe")) {
            await sleep(1000);
            continue; // Skip the rest of the loop
        }

        if (loadingDone == false) {
            loading.succeed("GTA SA Found!");
            loadingDone = true;
	        break;
        }
    }

    wsServer.on("connection", (ws) => {
        ws.send(JSON.stringify({
            type: "version"
        }));
    
        ws.on("message", (message) => {
            let data = JSON.parse(message);
            if(data.silentpatch == "true")
                console.log("Silent Patch Detected, It's Mean Chaos time not same with Game Time. But, it's okay! Dont Delete Silent Patch!");
            if (data.version != undefined) {
                g_VersionString = data.version;
                if(g_VersionString == g_sVersion) {
                    g_Version = true;
                } else {
                    g_Version = false;
                }
            } else if (data.name != undefined) {
                if (data.name == "effect") {
                    let effect = JSON.parse(effectDataBase)[
                        "Function"
                    ].find((x) => x.id == data.data.id);
                    if (effect == undefined) return; // How this possible?
                    wsServer.clients.forEach((clients) => {
                        let data = SendTheEffect(
                            effect,
                            userSeed,
                            rngInstance
                        );
                        clients.send(JSON.stringify(data));
                    });
                }
            }
        });
    });

    setTimeout(() => {
        if (g_Version == -1) {
            console.log("Failed to check the version!");
            console.log("Please check the client version!");
            console.log("Client Version: " + g_VersionString);
            console.log("Server Version: " + g_sVersion);
            exit();
        }
    }, 60000)

    let versionCheck = ora("Checking Version");
    versionCheck.spinner.interval = 100;
    versionCheck.start();

    while (true) {
        if (g_Version == -1) {
            await sleep(1000);
            continue;
        }

        if (g_Version == true) {
            versionCheck.succeed("Version Matched!");
            console.log("Client Version: " + g_VersionString);
            console.log("Server Version: " + g_sVersion);
            break;
        } else {
            versionCheck.fail("Version Mismatched!");
            console.log("Please update the client or server!");
            console.log("Client Version: " + g_VersionString);
            console.log("Server Version: " + g_sVersion);
            if(GeneralConfig.General.GTA_PATH != "empty" && GeneralConfig.General.GTA_PATH != null && GeneralConfig.General.GTA_PATH != "") {
                await killProcess("gta_sa.exe");
                let returnDir = process.cwd();
                process.chdir(GeneralConfig.General.GTA_PATH);
                await runProcessAndWaitToExit(GeneralConfig.General.GTA_PATH + "\\AutoUpdater.exe", () => {;
                    process.chdir(returnDir);
                    StartServer();
                })
            } else {
                console.log("Please update the client manually!");
                exit();
            }
            return;
        }
    }

    if (GeneralConfig.General.Seed == null) {
        setInterval(() => {
            userSeed = GenerateSeed();
            rngInstance = xoroshiro128plus(userSeed, 16);
        }, 1000); // Make Seed Random every 1 second
    }

    if(GeneralConfig.Tiktok.TiktokEnable) {
        if(GeneralConfig.Tiktok.TiktokForceEffect && GeneralConfig.Tiktok.TikfinityHTTPServer) {
            console.log("Tiktok Force Effect and Tikfinity HTTP Server cannot be enabled at the same time!");
            exit();
        }
        if(GeneralConfig.RapidFire.RapidFireEnable && GeneralConfig.Tiktok.TiktokVoteEnable)
            rapidFireHandler = new RapidFire(wsServer, effectDataBase, userSeed, rngInstance);
	if(!GeneralConfig.Tiktok.TikfinityHTTPServer)
            TiktokHandler = new TikTok(wsServer, effectDataBase, rapidFireHandler, userSeed, rngInstance);
    }
    if(!GeneralConfig.Tiktok.TikfinityHTTPServer) // Remove this interval when use HTTPServer
    setInterval(async () => {
        if(GeneralConfig.Tiktok.TiktokEnable && !GeneralConfig.Tiktok.TiktokUseBuiltInChaos) { // If Tiktok is enabled and not using built-in chaos
            TiktokHandler.HandleTheTimer();
        }
        else {
            if (remaining <= 0) {
                remaining = cooldown;
                let effect = GenerateRandom(
                    effectDataBase,
                    rngInstance,
                    GeneralConfig.EffectForceEffect.ForceSpecificEffect,
                    GeneralConfig.EffectForceEffect.EffectName,
                    GeneralConfig.EffectForceCategory.ForceSpecificCategory,
                    GeneralConfig.EffectForceCategory.CategoryName
                );
                wsServer.clients.forEach((clients) => {
                    let data = SendTheEffect(effect, userSeed, rngInstance);
                    clients.send(JSON.stringify(data));
                });
            } else {
                remaining -= 1000 / 24;
                wsServer.clients.forEach((clients) => {
                    clients.send(
                        JSON.stringify({
                            type: "time",
                            data: {
                                remaining: remaining,
                                cooldown: cooldown,
                                mode: "",
                            },
                        })
                    );
                });
            }
        }
    }, 1000 / 24);
}

StartServer();

function ValidateConfig(config) {

    let isThisNumber = (value) => {
        return value instanceof Number || typeof value === "number";
    }

    if(!isThisNumber(config.General.GUIWebsocketPort)) {
        console.log("GUI Websocket Port is not a number!");
        console.log("Please reconfigure at the website!");
        exit();
    }

    if(!isThisNumber(config.General.Seed) && config.General.Seed != null) {
        console.log("Seed is not a number!");
        console.log("Please reconfigure at the website!");
        exit();
    }

    if(!isThisNumber(config.General.Cooldown)) {
        console.log("Cooldown is not a number!");
        console.log("Please reconfigure at the website!");
        exit();
    }

    if(!isThisNumber(config.General.EffectDuration)) {
        console.log("Effect Duration is not a number!");
        console.log("Please reconfigure at the website!");
        exit();
    }

    if(!isThisNumber(config.RapidFire.RapidFireEffectDuration)) {
        console.log("Rapid Fire Duration is not a number!");
        console.log("Please reconfigure at the website!");
        exit();
    }

    if(!isThisNumber(config.Tiktok.TiktokVoteCooldown)) {
        console.log("Tiktok Vote Cooldown is not a number!");
        console.log("Please reconfigure at the website!");
        exit();
    }

    config.General.Seed = null; // Force It To Be Null (For Now)
}
