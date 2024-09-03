import { vehicleName, GenerateRandomVehicle } from "./random.js";
import { GeneralConfig } from "../shared/shared.js";

export class RapidFire {
    rapidFireEffect = [];
    effectDataBase = "";
    wsServer = null;
    maxEffect = 5;
    rngInstance = null;

    constructor(wsServer, effectDataBase, rngInstance) {
        this.rapidFireEffect = []; // Clear the database
        this.effectDataBase = JSON.parse(effectDataBase);
        this.wsServer = wsServer;
        this.rngInstance = rngInstance;
    }

    setMaxEffect(maxEffect) {
        this.maxEffect = maxEffect;
    }

    addEffectByName(effectName, owner) {

        effectName = effectName.replace(" ", ""); // Remove Space
        if(this.rapidFireEffect.length >= this.maxEffect) return;
        let effectList = this.effectDataBase["Function"];
        let effect = effectList.find((x) => x.description == effectName);
        console.log("[RapidFire] Effect Found: ", effect);
        if (effect == undefined) return;
        if(effect.exclusive && this.rapidFireEffect.find((x) => x.id == effect.id) != undefined) return; // Skip Exclusive Effect if already exist
        this.addEffectToDatabase(effect, owner);
    }

    addEffectToDatabase(effect, owner) {
        effect.owner = owner;
        this.rapidFireEffect.push(effect);
        console.log("[RapidFire] Added effect to database: ", effect);
    }

    sendAllEffectToClients() {
        this.rapidFireEffect.forEach(effect => {
            this.wsServer.clients.forEach((clients) => {
                let data = this.rapidFire_SendTheEffect(effect, effect.owner);
                clients.send(JSON.stringify(data));
            })
        })
        this.rapidFireEffect = []; // Clear the database
    }

    rapidFire_SendTheEffect(effect, owner) {
        let data = {};
        switch (effect.category) {
            case "Vehicle": {
                data = {
                    type: "effect",
                    data: {
                        effectID: "effect_spawn_vehicle",
                        effectData: { vehicleID: parseInt(effect.id) },
                        duration: GeneralConfig.RapidFire.RapidFireEffectDuration,
                        displayName: effect.name,
                        subtext: owner,
                    },
                };
                break;
            }
            case "Teleportation": {
                if (
                    effect.name == "Teleport To Waypoint" ||
                    effect.name == "Teleport To Liberty City"
                ) {
                    data = {
                        type: "effect",
                        data: {
                            effectID: "effect_" + effect.id,
                            effectData: {},
                            duration: GeneralConfig.RapidFire.RapidFireEffectDuration,
                            displayName: effect.name,
                            subtext: owner,
                        },
                    };
                } else if (effect.name == "Fake Teleport") {
                    // Fake TP
                    let fakeEffect = GenerateRandomLocationFromEffect(
                        effectDataBase,
                        rngInstance
                    );
                    data = {
                        type: "effect",
                        data: {
                            effectID: "effect_fake_teleport",
                            effectData: {
                                realEffectName: "Fake Teleport",
                                posX: fakeEffect.posX,
                                posY: fakeEffect.posY,
                                posZ: fakeEffect.posZ,
                            },
                            duration: GeneralConfig.RapidFire.RapidFireEffectDuration,
                            displayName: fakeEffect.name,
                            subtext: owner,
                        },
                    };
                    break;
                } else if (effect.name == "Random Teleport") {
                    let rnd = Math.floor(Math.random());
                    if (rnd == 0) {
                        // Random By Game
                        data = {
                            type: "effect",
                            data: {
                                effectID: "effect_random_teleport",
                                effectData: { seed: -1 },
                                duration: GeneralConfig.RapidFire.RapidFireEffectDuration,
                                displayName: "Random Teleport",
                                subtext: owner,
                            },
                        };
                    } else if (rnd == 1) {
                        // Random By Server
                        let location = GenerateRandomLocationFromEffect(
                            effectDataBase,
                            rngInstance
                        );
                        data = {
                            type: "effect",
                            data: {
                                effectID: "effect_teleport",
                                effectData: {
                                    posX: location.posX,
                                    posY: location.posY,
                                    posZ: location.posZ,
                                },
                                duration: GeneralConfig.RapidFire.RapidFireEffectDuration,
                                displayName: location.name,
                                subtext: owner,
                            },
                        };
                    }
                }
                break;
            }
            case "Weather": {
                data = {
                    type: "effect",
                    data: {
                        effectID: "effect_weather",
                        effectData: { weatherID: parseInt(effect.id) },
                        duration: GeneralConfig.RapidFire.RapidFireEffectDuration,
                        displayName: effect.name,
                        subtext: owner,
                    },
                };
                break;
            }
            case "CustomVehicle": {
                let theModel = effect.id;
                if (theModel == -1) {
                    theModel = GenerateRandomVehicle(rngInstance);
                }
                data = {
                    type: "effect",
                    data: {
                        effectID: "effect_custom_vehicle_spawns",
                        effectData: { vehicleID: parseInt(theModel) },
                        duration: GeneralConfig.RapidFire.RapidFireEffectDuration,
                        displayName: "Traffic Is " + vehicleName[theModel - 400],
                        subtext: owner,
                    },
                };
                break;
            }
            default: {
                data = {
                    type: "effect",
                    data: {
                        effectID: "effect_"+effect.id,
                        effectData: {
                            seed: -1,
                        },
                        duration: GeneralConfig.RapidFire.RapidFireEffectDuration,
                        displayName: effect.name,
                        subtext: owner,
                    },
                };
                break;
            }
        }
        return data;
    }
}