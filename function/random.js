import { GeneralConfig } from "../shared/shared.js";
import fs from "fs";

export let vehicleName = [
    "Landstalker",
    "Bravura",
    "Buffalo",
    "Linerunner",
    "Perennial",
    "Sentinel",
    "Dumper",
    "Firetruck",
    "Trashmaster",
    "Stretch",
    "Manana",
    "Infernus",
    "Voodoo",
    "Pony",
    "Mule",
    "Cheetah",
    "Ambulance",
    "Leviathan",
    "Moonbeam",
    "Esperanto",
    "Taxi",
    "Washington",
    "Bobcat",
    "Mr Whoopee",
    "BF Injection",
    "Hunter",
    "Premier",
    "Enforcer",
    "Securicar",
    "Banshee",
    "Predator",
    "Bus",
    "Rhino",
    "Barracks",
    "Hotknife",
    "Artic Trailer 1",
    "Previon",
    "Coach",
    "Cabbie",
    "Stallion",
    "Rumpo",
    "RC Bandit",
    "Romero",
    "Packer",
    "Monster",
    "Admiral",
    "Squalo",
    "Seasparrow",
    "Pizza Boy",
    "Tram",
    "Artic Trailer 2",
    "Turismo",
    "Speeder",
    "Reefer",
    "Tropic",
    "Flatbed",
    "Yankee",
    "Caddy",
    "Solair",
    "Top Fun",
    "Skimmer",
    "PCJ-600",
    "Faggio",
    "Freeway",
    "RC Baron",
    "RC Raider",
    "Glendale",
    "Oceanic",
    "Sanchez",
    "Sparrow",
    "Patriot",
    "Quad",
    "Coastguard",
    "Dinghy",
    "Hermes",
    "Sabre",
    "Rustler",
    "ZR-350",
    "Walton",
    "Regina",
    "Comet",
    "BMX",
    "Burrito",
    "Camper",
    "Marquis",
    "Baggage",
    "Dozer",
    "Maverick",
    "VCN Maverick",
    "Rancher",
    "FBI Rancher",
    "Virgo",
    "Greenwood",
    "Jetmax",
    "Hotring",
    "Sandking",
    "Blista Compact",
    "Police maverick",
    "Boxville",
    "Benson",
    "Mesa",
    "RC Goblin",
    "Hotring A",
    "Hotring B",
    "Bloodring Banger",
    "Rancher",
    "Super GT",
    "Elegant",
    "Journey",
    "Bike",
    "Mountain Bike",
    "Beagle",
    "Cropduster",
    "Stuntplane",
    "Petrol",
    "Roadtrain",
    "Nebula",
    "Majestic",
    "Buccaneer",
    "Shamal",
    "Hydra",
    "FCR-900",
    "NRG-500",
    "HPV1000",
    "Cement",
    "Towtruck",
    "Fortune",
    "Cadrona",
    "FBI Truck",
    "Willard",
    "Forklift",
    "Tractor",
    "Combine",
    "Feltzer",
    "Remington",
    "Slamvan",
    "Blade",
    "Freight",
    "Streak",
    "Vortex",
    "Vincent",
    "Bullet",
    "Clover",
    "Sadler",
    "Firetruck LA",
    "Hustler",
    "Intruder",
    "Primo",
    "Cargobob",
    "Tampa",
    "Sunrise",
    "Merit",
    "Utility Van",
    "Nevada",
    "Yosemite",
    "Windsor",
    "Monster A",
    "Monster B",
    "Uranus",
    "Jester",
    "Sultan",
    "Stratum",
    "Elegy",
    "Raindance",
    "RC Tiger",
    "Flash",
    "Tahoma",
    "Savanna",
    "Bandito",
    "Freight",
    "Streak",
    "Kart",
    "Mower",
    "Dune",
    "Sweeper",
    "Broadway",
    "Tornado",
    "AT-400",
    "DFT-30",
    "Huntley",
    "Stafford",
    "BF-400",
    "Newsvan",
    "Tug",
    "Petrol Tanker",
    "Emperor",
    "Wayfarer",
    "Euros",
    "Hotdog",
    "Club",
    "Freight Box",
    "Artic Trailer 3",
    "Andromada",
    "Dodo",
    "RC Cam",
    "Launch",
    "Cop Car LS",
    "Cop Car SF",
    "Cop Car LV",
    "Ranger",
    "Picador",
    "S.W.A.T. Tank",
    "Alpha",
    "Phoenix",
    "Glendale",
    "Sadler",
    "Bag Box A",
    "Bag Box B",
    "Stairs",
    "Boxville",
    "Farm Trailer",
    "Utility Van Trailer",
];

let vehiclePossibleToSpawn = [
    // Bikes
    581, // BF-400
    481, // BMX
    462, // Faggio
    521, // FCR-900
    463, // Freeway
    522, // NRG-500
    461, // PCJ-600
    448, // Pizzaboy
    468, // Sanchez

    // 2-Door & Compact Cars
    602, // Alpha
    496, // Blista Compact
    401, // Bravura
    518, // Buccaneer
    527, // Cadrona
    589, // Club
    419, // Esperanto
    587, // Euros
    533, // Feltzer
    526, // Fortune
    474, // Hermes
    545, // Hustler
    517, // Majestic
    410, // Manana
    600, // Picador
    436, // Previon
    439, // Stallion
    549, // Tampa
    491, // Virgo

    // 4-Door & Luxury Cars
    445, // Admiral
    604, // Damaged Glendale
    507, // Elegant
    585, // Emperor
    466, // Glendale
    492, // Greenwood
    546, // Intruder
    551, // Merit
    516, // Nebula
    467, // Oceanic
    426, // Premier
    547, // Primo
    405, // Sentinel
    580, // Stafford
    409, // Stretch
    550, // Sunrise
    566, // Tahoma
    540, // Vincent
    421, // Washington
    529, // Willard

    // Civil Service
    485, // Baggage
    431, // Bus
    438, // Cabbie
    437, // Coach
    574, // Sweeper
    420, // Taxi
    525, // Towtruck
    408, // Trashmaster
    552, // Utility Van

    // Government Vehicles
    416, // Ambulance
    433, // Barracks
    427, // Enforcer
    490, // FBI Rancher
    528, // FBI Truck
    407, // Fire Truck
    523, // HPV1000
    470, // Patriot
    596, // Police LS
    598, // Police LV
    599, // Police Ranger
    597, // Police SF
    432, // Rhino
    601, // S.W.A.T.
    428, // Securicar

    // Heavy & Utility Trucks
    499, // Benson
    498, // Boxville
    524, // Cement Truck
    532, // Combine Harvester
    578, // DFT-30
    486, // Dozer
    406, // Dumper
    573, // Dune
    455, // Flatbed
    588, // Hotdog
    403, // Linerunner
    423, // Mr. Whoopee
    414, // Mule
    443, // Packer
    515, // Roadtrain
    514, // Tanker
    531, // Tractor
    456, // Yankee

    // Light Trucks & Vans
    459, // Berkley's RC Van
    422, // Bobcat
    482, // Burrito
    605, // Damaged Sadler
    530, // Forklift
    418, // Moonbeam
    572, // Mower
    582, // News Van
    413, // Pony
    440, // Rumpo
    543, // Sadler
    583, // Tug
    478, // Walton
    554, // Yosemite

    // SUVs & Wagons
    579, // Huntley
    400, // Landstalker
    404, // Perennial
    489, // Rancher
    479, // Regina
    442, // Romero
    458, // Solair

    // Lowriders
    536, // Blade
    575, // Broadway
    534, // Remington
    567, // Savanna
    535, // Slamvan
    576, // Tornado
    412, // Voodoo

    // Muscle Cars
    402, // Buffalo
    542, // Clover
    603, // Phoenix
    475, // Sabre

    // Street Racers
    429, // Banshee
    541, // Bullet
    415, // Cheetah
    480, // Comet
    562, // Elegy
    565, // Flash
    434, // Hotknife
    494, // Hotring Racer
    411, // Infernus
    559, // Jester
    561, // Stratum
    560, // Sultan
    506, // Super GT
    451, // Turismo
    558, // Uranus
    555, // Windsor
    477, // ZR-350

    // Recreational
    568, // Bandito
    424, // BF Injection
    504, // Bloodring Banger
    457, // Caddy
    483, // Camper
    508, // Journey
    571, // Kart
    500, // Mesa
    444, // Monster
    471, // Quadbike
    495, // Sandking
    539, // Vortex
];

const randomNess = (min, max, rngInstance) => {
    const out = (rngInstance.unsafeNext() >>> 0) / 0x100000000;
    return min + Math.floor(out * (max - min + 1));
};

export function GenerateSeed() {
    return Date.now() ^ (Math.random() * 0xfffffffffffff);
}

export function GenerateRandom(
    effectDataBase,
    rngInstance,
    forceEffect = false,
    effectName = "",
    forceCategory = false,
    categoryName = ""
) {
    if (forceEffect && effectName == "")
        throw new Error("No Effect Provided");

    if(forceEffect) {
        return {
            category: "Force",
            name: `Force Effect of ${effectName}`,
            description: 'Force Effect!',
            id: `effect_${effectName}`,
        };
    } // We Dont Use Effect Database if Force Effect is Enable

    if (!effectDataBase) return "No Effect Data Base Provided";
    // First We Take The Category

    effectDataBase = JSON.parse(effectDataBase);
    // Remove an object from effectDataBase

    let effectList = effectDataBase["Function"];

    if (forceCategory && categoryName == "")
        throw new Error("No Category Provided");

    effectList = effectList.filter((effect) => {
        if (forceCategory) {
            return effect.category == categoryName;
        }
        return true;
    });
    // Then We Take The Effect
    const randomNess = (min, max) => {
        const out = (rngInstance.unsafeNext() >>> 0) / 0x100000000;
        return min + Math.floor(out * (max - min + 1));
    };

    let num = randomNess(0, effectList.length - 1, rngInstance);
    let effect = effectList[num];
    // Then We Take The Name
    let name =
        effect.category == "Vehicle"
            ? "Spawn " + effect.id == -1 ? "Random Vehicle" : vehicleName[effect.id - 400]
            : effect.category == "Teleportation"
            ? "" + effect.name
            : effect.name;
    // Then We Take The Description
    let description = effect.description || "No Description Provided";
    // Then We Take The ID
    let id = effect.id || -1;
    // Then We Return The Data
    let ret = {};
    ret = {
        category: effect.category,
        name: name,
        description: description,
        id:
            effect.category == "Vehicle" ||
            effect.category == "Weather" ||
            effect.category == "CustomVehicle"
                ? id
                : "effect_" + id,
    };
    if (ret == {})
        throw new Error(
            `No Return Provided\nRandomNess : ${num}\nEffectList : ${effectList}`
        );
    return ret;
}

export function GenerateRandomLocationFromEffect(effectDataBase, rngInstance) {
    if (!effectDataBase) return "No Effect Data Base Provided";
    // First We Take The Category
    let ret = {};

    effectDataBase = JSON.parse(effectDataBase);
    // Remove an object from effectDataBase

    let effectList = effectDataBase["Location"];
    let num = randomNess(0, effectList.length - 1, rngInstance);
    let effect = effectList[num];

    // Then We Take The Name
    let name = "Teleport To " + effect.name;
    // Then We Take The Description
    let description = effect.description || "No Description Provided";

    ret = {
        name: name,
        description: description,
        x: effect.x,
        y: effect.y,
        z: effect.z,
    };

    if (ret == {})
        throw new Error(
            `No Location Provided\nRandomNess : ${num}\nEffectList : ${effectList}`
        );

    return ret;
}

export function GenerateRandomVehicle(rngInstance) {
    let num = randomNess(0, vehiclePossibleToSpawn.length - 1, rngInstance);
    return vehiclePossibleToSpawn[num];
}

export function SendTheEffect(effect, userSeed, rngInstance) {
    let data = {};
    console.log(effect)
    switch (effect.category) {
        case "Vehicle": {
            if(effect.id.includes("effect_"))
                effect.id = effect.id.split("effect_")[1];

            if (effect.id == -1) {
                effect.id = GenerateRandomVehicle(rngInstance);
            }
            data = {
                type: "effect",
                data: {
                    effectID: "effect_spawn_vehicle",
                    effectData: { vehicleID: parseInt(effect.id) },
                    duration: GeneralConfig.General.EffectDuration,
                    displayName: effect.name,
                    subtext: "",
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
                        effectID: effect.id,
                        effectData: {},
                        duration: GeneralConfig.General.EffectDuration,
                        displayName: effect.name,
                        subtext: "",
                    },
                };
            } else if (effect.name == "Fake Teleport") {
                // Fake TP
                let rnd = randomNess(0, 1, rngInstance);
                if (rnd == 0) {
                    // Random By Game
                    data = {
                        type: "effect",
                        data: {
                            effectID: "effect_fake_teleport",
                            effectData: { seed: randomNess(0, 100000000, rngInstance) },
                            duration: GeneralConfig.General.EffectDuration,
                            displayName: "Random Teleport",
                            subtext: "",
                        },
                    };
                } else if (rnd == 1) {
                    // Random By Server
                    let location = GenerateRandomLocationFromEffect(
                        fs.readFileSync("effects.json"),
                        rngInstance
                    );
                    data = {
                        type: "effect",
                        data: {
                            effectID: "effect_fake_teleport",
                            effectData: {
                                posX: location.x,
                                posY: location.y,
                                posZ: location.z,
                            },
                            duration: GeneralConfig.General.EffectDuration,
                            displayName: location.name,
                            subtext: "",
                        },
                    };
                }
                break;
            } else if (effect.name == "Random Teleport") {
                let rnd = randomNess(0, 1, rngInstance);
                if (rnd == 0) {
                    // Random By Game
                    data = {
                        type: "effect",
                        data: {
                            effectID: "effect_random_teleport",
                            effectData: { seed: randomNess(0, 100000000, rngInstance) },
                            duration: GeneralConfig.General.EffectDuration,
                            displayName: "Random Teleport",
                            subtext: "",
                        },
                    };
                } else if (rnd == 1) {
                    // Random By Server
                    let location = GenerateRandomLocationFromEffect(
                        fs.readFileSync("effects.json"),
                        rngInstance
                    );
                    data = {
                        type: "effect",
                        data: {
                            effectID: "effect_teleport",
                            effectData: {
                                posX: location.x,
                                posY: location.y,
                                posZ: location.z,
                            },
                            duration: GeneralConfig.General.EffectDuration,
                            displayName: location.name,
                            subtext: "",
                        },
                    };
                }
            }
            break;
        }
        case "Weather": {
            if(effect.id.includes("effect_"))
                effect.id = effect.id.split("effect_")[1];
            data = {
                type: "effect",
                data: {
                    effectID: "effect_weather",
                    effectData: { weatherID: parseInt(effect.id) },
                    duration: GeneralConfig.General.EffectDuration,
                    displayName: effect.name,
                    subtext: "",
                },
            };
            break;
        }
        case "CustomVehicle": {
            if(effect.id.includes("effect_"))
                effect.id = effect.id.split("effect_")[1];
            let theModel = effect.id;
            if (theModel == -1) {
                theModel = GenerateRandomVehicle(rngInstance);
            }
            data = {
                type: "effect",
                data: {
                    effectID: "effect_custom_vehicle_spawns",
                    effectData: { vehicleID: parseInt(theModel) },
                    duration: GeneralConfig.General.EffectDuration,
                    displayName: "Traffic Is " + vehicleName[theModel - 400],
                    subtext: "",
                },
            };
            break;
        }
        default: {
            if(!effect.id.includes("effect_"))
                effect.id = "effect_" + effect.id;
            data = {
                type: "effect",
                data: {
                    effectID: effect.id,
                    effectData: {
                        seed: userSeed,
                    },
                    duration: GeneralConfig.General.EffectDuration,
                    displayName: effect.name,
                    subtext: "",
                },
            };
            break;
        }
    }
    console.log("Sending Effect", data);
    return data;
}
