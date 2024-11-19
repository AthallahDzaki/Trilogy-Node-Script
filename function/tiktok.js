import { WebcastPushConnection } from "tiktok-live-connector";
import { WebSocket } from "ws";
import { exit } from "process";
import { SendTheEffect, GenerateRandom } from "./random.js";
import { eVotingMode, ePickedVote, GeneralConfig } from "../shared/shared.js";
import fs from "fs";
import axios from "axios";

let internal_Config = GeneralConfig.Tiktok;

class TikTokHandler {
    voteMode = eVotingMode.COOLDOWN;
    votePicked = ePickedVote.UNDETERMINED;
    votePicker = [0, 0, 0];
    votePickerUID = []; // From Chat (+1)
    votePickerExclusiveUID = []; // From Gift (+5)
    voteCooldown = internal_Config.TiktokVoteCooldown;
    voteRemaining = internal_Config.TiktokVoteCooldown;
    voteEffect = [];
    voteMaxLength = 3;

    constructor(
        wsServer,
        effectDataBase,
        rapidFireHandler,
        userSeed,
        rngInstance
    ) {
        this.wsServer = wsServer;
        this.effectDataBase = effectDataBase;
        this.rapidFireHandler = rapidFireHandler;
        this.userSeed = userSeed;
        this.rngInstance = rngInstance;

        if (typeof internal_Config.TiktokUseIndofinity == "undefined") {
            internal_Config.TiktokUseIndofinity = false;
            fs.writeFileSync(
                "config.json",
                JSON.stringify(GeneralConfig, null, 4)
            );
        }

        if (internal_Config.TikfinityEnable) {
            this.tiktokConnection = new WebSocket(
                `ws://localhost:${
                    internal_Config.TiktokUseIndofinity == false ? 21213 : 62024
                }/`
            );
        } else {
            this.tiktokConnection = new WebcastPushConnection(
                internal_Config.TiktokUsername,
                {
                    sessionId: internal_Config.TiktokSessionId || null
                }
            );
        }
    }

    internal_ValidateData() {
        if (
            internal_Config.TiktokUsername == "" &&
            !internal_Config.TikfinityEnable
        ) {
            console.log(
                "Tiktok Username is not set. Please set it in the config.json file."
            );
            exit();
        }
        if (internal_Config.TiktokForceEffect) {
            if (
                JSON.parse(fs.readFileSync("gifts.json", "utf8")).find(
                    (x) => x.run_effect != ""
                ) == undefined
            ) {
                console.log(
                    "No effects found in gifts.json. Please add at least 1 effects to gifts.json."
                );
                exit();
            }

            JSON.parse(fs.readFileSync("gifts.json", "utf8")).forEach(
                (gift) => {
                    if (gift.run_effect == "") return;
                    let effects = JSON.parse(this.effectDataBase)["Function"];
                    if (
                        effects.find((x) => x.description == gift.run_effect) ==
                        undefined
                    ) {
                        console.log(`Effect not found for gift: ${gift.name}`);
                        exit();
                    }
                }
            );
        }
    }

    GetReturnVoteID(id) {
        switch (id) {
            case 0: {
                return ePickedVote.FIRST;
            }
            case 1: {
                return ePickedVote.SECOND;
            }
            case 2: {
                return ePickedVote.THIRD;
            }
        }
    }

    HandleTheTimer() {
        if (!GeneralConfig.Tiktok.TiktokVoteEnable) return; // Skip if the vote is disabled
        switch (this.voteMode) {
            case eVotingMode.COOLDOWN: {
                if (this.voteEffect.length < this.voteMaxLength) {
                    let theEffect = GenerateRandom(
                        this.effectDataBase,
                        this.rngInstance
                    );

                    this.voteEffect.push(theEffect);
                }

                if (this.voteRemaining <= 0) {
                    this.voteMode = eVotingMode.VOTING;
                    this.voteRemaining = this.voteCooldown;
                }
                break;
            }
            case eVotingMode.VOTING: {
                if (this.voteRemaining <= 0) {
                    let highestVote = Math.max(...this.votePicker);
                    let highestIndex = this.votePicker.indexOf(highestVote);
                    let pickedEffect = this.voteEffect[highestIndex];

                    if (
                        pickedEffect.id.includes("rapid_fire") &&
                        GeneralConfig.RapidFire.RapidFireEnable
                    ) {
                        this.voteMode = eVotingMode.RAPID_FIRE;
                        this.voteRemaining = 15000;
                        this.voteCooldown = 15000;
                        break;
                    } else {
                        // So.. rapid fire is disabled, we need to regenerate the effect
                        if (pickedEffect.id.includes("rapid_fire")) {
                            this.voteEffect[highestIndex] = GenerateRandom(
                                this.effectDataBase,
                                this.rngInstance
                            );
                            highestVote = Math.max(...this.votePicker);
                            highestIndex = this.votePicker.indexOf(highestVote);
                            pickedEffect = this.voteEffect[highestIndex];
                        }
                    }

                    let effect = SendTheEffect(
                        pickedEffect,
                        this.userSeed,
                        this.rngInstance
                    );

                    let voteEffectName = this.voteEffect.map((x) => x.name);

                    this.wsServer.clients.forEach((clients) => {
                        clients.send(JSON.stringify(effect));
                        clients.send(
                            JSON.stringify({
                                type: "votes",
                                data: {
                                    effects: voteEffectName,
                                    votes: this.votePicker,
                                    pickedChoice:
                                        this.GetReturnVoteID(highestIndex),
                                },
                            })
                        );
                    });

                    this.voteMode = eVotingMode.COOLDOWN;
                    this.voteCooldown = internal_Config.TiktokVoteCooldown;
                    this.voteRemaining = this.voteCooldown;
                    this.votePicked = ePickedVote.UNDETERMINED;
                    this.votePicker = [0, 0, 0];
                    this.VotePickerUID = [];
                    this.voteEffect = [];
                } else {
                    let voteEffectName = this.voteEffect.map((x) => x.name);
                    this.wsServer.clients.forEach((clients) => {
                        clients.send(
                            JSON.stringify({
                                type: "votes",
                                data: {
                                    effects: voteEffectName,
                                    votes: this.votePicker,
                                    pickedChoice: ePickedVote.UNDETERMINED,
                                },
                            })
                        );
                    });
                }
            }
            case eVotingMode.RAPID_FIRE: {
                if (this.voteRemaining <= 0) {
                    this.rapidFireHandler.sendAllEffectToClients();
                    this.voteMode = eVotingMode.COOLDOWN;
                    this.voteCooldown = internal_Config.TiktokVoteCooldown;
                    this.voteRemaining = this.voteCooldown;
                    this.votePicked = ePickedVote.UNDETERMINED;
                    this.votePicker = [0, 0, 0];
                    this.voteEffect = [];
                }
            }
        }
        this.voteRemaining -= 10;
        this.wsServer.clients.forEach((clients) => {
            clients.send(
                JSON.stringify({
                    type: "time",
                    data: {
                        remaining: this.voteRemaining,
                        cooldown: this.voteCooldown,
                        mode:
                            this.voteMode == eVotingMode.COOLDOWN
                                ? "Cooldown"
                                : this.voteMode == eVotingMode.VOTING
                                ? "Voting"
                                : "Rapid Fire TIME!!!",
                    },
                })
            );
        });
    }

    onMessage(data) {
        if (data.uniqueId == "athallah.dzaki" || data.uniqueId == internal_Config.owner) {
            let message = data.comment || data.message;
            let splitMessage = message.split(" ");
            switch (splitMessage[0]) {
                case "!feffect": {
                    let effect = {
                        category: "Function",
                        name: "Dev Check Effect " + splitMessage[1],
                        description: "Dev Check",
                        id: splitMessage[1],
                        exclusive: false,
                    };
                    this.wsServer.clients.forEach((clients) => {
                        let data = SendTheEffect(
                            effect,
                            this.userSeed,
                            this.rngInstance
                        );
                        clients.send(JSON.stringify(data));
                    });
                    break;
                }
                case "!effect": {
                    let effect = JSON.parse(this.effectDataBase)[
                        "Function"
                    ].find((x) => x.id == splitMessage[1]);
                    if (effect == undefined) return;
                    this.wsServer.clients.forEach((clients) => {
                        let data = SendTheEffect(
                            effect,
                            this.userSeed,
                            this.rngInstance
                        );
                        clients.send(JSON.stringify(data));
                    });
                    break;
                }
                case "!dospin": {
                    axios.get("http://localhost/effect").catch(e => console.log("Failed to Send to Wheel of Fortune", e.code));
                    break;
                }
                case "!checkveh": {
                    let tmp_data = {
                        category: "Vehicle",
                        name: "Dev Check Spawn " + splitMessage[1],
                        description: "Dev Check",
                        id: splitMessage[1],
                        exclusive: false,
                    };
                    this.wsServer.clients.forEach((clients) => {
                        let data = SendTheEffect(
                            tmp_data,
                            this.userSeed,
                            this.rngInstance
                        );
                        clients.send(JSON.stringify(data));
                    });
                    break;
                }
                case "!checkgift": {
                    let gift = JSON.parse(
                        fs.readFileSync("gifts.json", "utf8")
                    ).find((x) => x.id == splitMessage[1]);
                    if (gift == undefined) return; // We skip the gift if not found
                    if (gift.run_effect != "") {
                        let effects = JSON.parse(this.effectDataBase)[
                            "Function"
                        ];
                        let findEffect = effects.find(
                            (x) => x.description == gift.run_effect
                        );
                        if (findEffect == undefined) return;
                        this.wsServer.clients.forEach((clients) => {
                            findEffect.id = "effect_" + findEffect.id;
                            let data = SendTheEffect(
                                findEffect,
                                this.userSeed,
                                this.rngInstance
                            );
                            clients.send(JSON.stringify(data));
                        });
                    }
                    break;
                }
            }
        }
        switch (this.voteMode) {
            case eVotingMode.VOTING: {
                if (this.votePickerUID.includes(data.uniqueId)) return;
                let message = GeneralConfig.Tiktok.TikfinityEnable
                    ? data.comment
                    : data.message;
                switch (message) {
                    case "#1": {
                        this.votePicker[0]++;
                        this.votePickerUID.push(data.uniqueId);
                        this.votePicked |= ePickedVote.FIRST;
                        break;
                    }
                    case "#2": {
                        this.votePicker[1]++;
                        this.votePickerUID.push(data.uniqueId);
                        this.votePicked |= ePickedVote.SECOND;
                        break;
                    }
                    case "#3": {
                        this.votePicker[2]++;
                        this.votePickerUID.push(data.uniqueId);
                        this.votePicked |= ePickedVote.THIRD;
                        break;
                    }
                }
                break;
            }
            case eVotingMode.RAPID_FIRE: {
                let message = GeneralConfig.Tiktok.TikfinityEnable
                    ? data.comment
                    : data.message;
                this.rapidFireHandler.addEffectByName(message, data.uniqueId);
                break;
            }
        }
    }

    onDonation(data) {
        // For this version, we start with Hard Code effect
        let amount = data.amount || data.amount_raw;
        if (amount >= 200000) {
            let effect = {
                category: "Function",
                name: "Let's Start New Game",
                description: "Force New Game From Donation",
                id: "newgame",
                exclusive: false,
            };
            console.log(effect);
            this.wsServer.clients.forEach((clients) => {
                let data = SendTheEffect(
                    effect,
                    this.userSeed,
                    this.rngInstance
                );
                clients.send(JSON.stringify(data));
            });
        }

        if (amount == 5000) {
                axios.get("http://localhost/effect").catch(e => console.log("Failed to Send to Wheel of Fortune", e.code));
                console.log("Send Wheel of Fortune");
            
        }

        return;

        if (fs.existsSync("donation.json")) {
            let donation = JSON.parse(fs.readFileSync("donation.json", "utf8"));
            let findDonation = donation.find((x) => x.amount == amount);
            if (findDonation != undefined) {
                let effect = JSON.parse(this.effectDataBase)["Function"];
                let findEffect = effect.find(
                    (x) => x.description == findDonation.effect
                );
                if (findEffect == undefined) return;
                this.wsServer.clients.forEach((clients) => {
                    let data = SendTheEffect(
                        findEffect,
                        this.userSeed,
                        this.rngInstance
                    );
                    clients.send(JSON.stringify(data));
                });
            }
        }
    }

    onGift(data) {
        if (
            !GeneralConfig.Tiktok.TikfinityHTTPServer &&
            GeneralConfig.Tiktok.TiktokForceEffect
        ) {
            if(data.repeatEnd) return; // We skip the gift if it's repeat end
            let gift = JSON.parse(fs.readFileSync("gifts.json", "utf8")).find(
                (x) => x.id == data.giftId
            );
            if (gift == undefined) return; // We skip the gift if not found
            if (gift.run_effect != "") {
                let effects = JSON.parse(this.effectDataBase)["Function"];
                let findEffect = effects.find(
                    (x) => x.description == gift.run_effect
                );
                if (findEffect == undefined) return;
                // if (findEffect.exclusive && !data.repeatEnd) return; // We Skip Exclusive Effects until not repeat

                this.wsServer.clients.forEach((clients) => {
                    findEffect.id = "effect_" + findEffect.id;
                    let edata = SendTheEffect(
                        findEffect,
                        this.userSeed,
                        this.rngInstance
                    );
                    clients.send(JSON.stringify(edata));
                });
            }
        }
        if (this.voteMode == eVotingMode.VOTING) {
            if (this.votePickerExclusiveUID.includes(data.uniqueId)) return;
            switch (data.giftId) {
                case 5655: {
                    // Rose
                    this.votePicker[0] += 5;
                    this.votePickerExclusiveUID.push(data.uniqueId);
                    this.votePicked |= ePickedVote.FIRST;
                    break;
                }
                case 5333: {
                    // Coffe
                    this.votePicker[1] += 5;
                    this.votePickerExclusiveUID.push(data.uniqueId);
                    this.votePicked |= ePickedVote.SECOND;
                    break;
                }
                case 6064: {
                    // GG
                    this.votePicker[2] += 5;
                    this.votePickerExclusiveUID.push(data.uniqueId);
                    this.votePicked |= ePickedVote.THIRD;
                    break;
                }
            }
        }
    }

    SetupTiktok() {
        this.internal_ValidateData();
        if (internal_Config.TikfinityEnable) {
            this.tiktokConnection.on("open", () => {
                console.log(
                    `Connected to ${
                        internal_Config.TiktokUseIndofinity
                            ? "Indofinity"
                            : "Tikfinity"
                    } Server`
                );
            });

            let donationPlatform = [ "saweria", "sociabuzz", "trakteer", "tako" ];

            this.tiktokConnection.on("message", (data) => {
                let wsData = JSON.parse(data);
                if (wsData.event == "chat") {
                    this.onMessage(wsData.data);
                } else if (wsData.event == "gift") {
                    this.onGift(wsData.data);
                } else if (donationPlatform.some(platform => wsData.event.includes(platform))) {
                    this.onDonation(wsData.data);
                } else if (wsData.event == "tiktokConnected" || wsData.event == "liveDetected") {
                    internal_Config.owner = wsData.data.roomInfo.uniqueId
                    console.info(`Connected to Tiktok Interactive to Room ${wsData.data.roomInfo.nickname} with Room ID ${wsData.data.roomId}`);
                }
            });
        } else {
            this.tiktokConnection
                .connect()

                .then((state) => {
                    internal_Config.owner = state.roomInfo.owner.display_id;
                    console.info(`Connected to Tiktok Interactive to Room ${state.roomInfo.owner.nickname} with Room ID ${state.roomId}`);
                })
                .catch((err) => {
                    console.error("Failed to connect", err);
                });

            this.tiktokConnection.on("chat", (data) => {
                this.onMessage(data);
            });

            this.tiktokConnection.on("gift", (data) => {
                this.onGift(data);
            });
        }

        this.tiktokConnection.on("error", (err) => {
            if(err.code == "ECONNREFUSED") {
                console.log(`Connection Refused from Tiktok Interactive. Please make sure the ${internal_Config.TiktokUseIndofinity ? "Indofinity" : "Tikfinity"} is running.`);
                exit();
            }
        })
    }
}

export class TikTok extends TikTokHandler {
    constructor(
        wsServer,
        effectDataBase,
        rapidFireHandler,
        userSeed,
        rngInstance
    ) {
        super(
            wsServer,
            effectDataBase,
            rapidFireHandler,
            userSeed,
            rngInstance
        );
        this.SetupTiktok();
    }
}
