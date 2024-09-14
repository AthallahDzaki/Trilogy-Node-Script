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

import { sleep, findRunningProcess } from "./function/utils.js";

import { GeneralConfig } from "./shared/shared.js";
import { API } from "./function/api.js";

let wsServer = new WebSocketServer({ port: GeneralConfig.General.WebSocketGUIPort || 42069 });

console.log("Server Started!");

let userSeed, rngInstance, rapidFireHandler, TiktokHandler;

(async () => {
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

    let effectDataBase = readFileSync("./effects.json", "utf8");

    userSeed = GeneralConfig.General.Seed || GenerateSeed();
    console.log(`Seed: ${userSeed}`);
    rngInstance = xoroshiro128plus(userSeed, 16);

    let cooldown = GeneralConfig.General.Cooldown || 30000;
    let remaining = cooldown;

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

    if(GeneralConfig.Tiktok.TiktokEnable) {
        if(GeneralConfig.Tiktok.TiktokForceEffect && GeneralConfig.Tiktok.TikfinityHTTPServer) {
            console.log("Tiktok Force Effect and Tikfinity HTTP Server cannot be enabled at the same time!");
            exit();
        }
        if(GeneralConfig.Tiktok.TikfinityHTTPServer)
            new API(effectDataBase, wsServer, userSeed, rngInstance);
        if(GeneralConfig.RapidFire.RapidFireEnable && GeneralConfig.Tiktok.TiktokVoteEnable)
            rapidFireHandler = new RapidFire(wsServer, effectDataBase, userSeed, rngInstance);
        TiktokHandler = new TikTok(wsServer, effectDataBase, rapidFireHandler, userSeed, rngInstance);
    }

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
                remaining -= 10;
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
    }, 10);
})();
