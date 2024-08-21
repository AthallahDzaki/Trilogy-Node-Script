import { WebcastPushConnection } from "tiktok-live-connector";
import { WebSocket } from "ws";
import { exit } from "process";
import { SendTheEffect, GenerateRandom } from "./random.js";
import { eVotingMode, ePickedVote, GeneralConfig } from "../shared/shared.js";
import fs from "fs";

let internal_Config = GeneralConfig.Tiktok;
let internal_theGift = JSON.parse(fs.readFileSync("gifts.json", "utf8"));

class TikTokHandler {
    voteMode = eVotingMode.COOLDOWN;
    votePicked = ePickedVote.UNDETERMINED;
    votePicker = [0, 0, 0];
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
        if (internal_Config.TikfinityEnable) {
            this.tiktokConnection = WebSocket("ws://localhost:21213/");
        } else {
            this.tiktokConnection = new WebcastPushConnection(
                internal_Config.TiktokUsername,
                {
                    sessionId: internal_Config.TiktokSessionId || null,
                }
            );
        }
    }

    internal_ValidateData() {
        if (internal_Config.TiktokUsername == "" && !internal_Config.TikfinityEnable) {
            console.log(
                "Tiktok Username is not set. Please set it in the config.json file."
            );
            exit();
        }
        if (internal_Config.TiktokForceEffect) {
            if (internal_theGift.find((x) => x.run_effect != "") == undefined) {
                console.log(
                    "No effects found in gifts.json. Please add at least 1 effects to gifts.json."
                );
                exit();
            }

            internal_theGift.forEach((gift) => {
                if (gift.run_effect == "") return;
                let effects = JSON.parse(this.effectDataBase)["Function"];
                if (
                    effects.find((x) => x.description == gift.run_effect) == undefined
                ) {
                    console.log(`Effect not found for gift: ${gift.name}`);
                    exit();
                }
            });
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
        switch (this.voteMode) {
            case eVotingMode.COOLDOWN: {
                if (this.voteEffect.length < this.voteMaxLength) {
                    // let theEffect = GenerateRandom(
                    //     this.effectDataBase,
                    //     this.rngInstance
                    // );
                    let theEffect = {
                        category: "RapidFire",
                        name: "Rapid-Fire",
                        description: "SystemOverload",
                        id: "effect_rapid_fire",
                    };
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

                    console.log(pickedEffect.id);
                    console.log(GeneralConfig.RapidFire.RapidFireEnable);

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
                    this.voteEffect = [];
                } else {
                    this.wsServer.clients.forEach((clients) => {
                        clients.send(
                            JSON.stringify({
                                type: "votes",
                                data: {
                                    effects: ["???", "???", "???"],
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

    onMessage(message) {
        switch (this.voteMode) {
            case eVotingMode.VOTING: {
                switch (message) {
                    case "#1": {
                        this.votePicker[0]++;
                        this.votePicked |= ePickedVote.FIRST;
                        break;
                    }
                    case "#2": {
                        this.votePicker[1]++;
                        this.votePicked |= ePickedVote.SECOND;
                        break;
                    }
                    case "#3": {
                        this.votePicker[2]++;
                        this.votePicked |= ePickedVote.THIRD;
                        break;
                    }
                }
                break;
            }
            case eVotingMode.RAPID_FIRE: {
                this.rapidFireHandler.addEffectByName(message, data.uniqueId);
                break;
            }
        }
    }

    onGift(data) {
        let gift = internal_theGift.find((x) => x.id == data.giftId);
        if (gift.run_effect) {
            let effects = JSON.parse(this.effectDataBase)["Function"];
            let findEffect = effects.find((x) => x.name == gift.run_effect);
            if (findEffect.exclusive && data.repeatEnd == false) return; // We Skip Exclusive Effects (Avoid Crash)
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
    }

    SetupTiktok() {
        this.internal_ValidateData();
        if (internal_Config.TikfinityEnable) {
            this.tiktokConnection.on("open", () => {
                console.log("Connected to Tikfinity");
            });

            this.tiktokConnection.on("message", (data) => {
                data = JSON.parse(data);
                // {
                //     "event": "chat",
                //     "data": { }
                // }
                if(data.event == "chat") {
                    let message = data.data.comment;
                    this.onMessage(message);
                }
                else if(data.event == "gift") {
                    this.onGift(data.data);
                }
            });
        } else {
            this.tiktokConnection
                .connect()

                .then((state) => {
                    console.info(`Connected to roomId ${state.roomId}`);
                })
                .catch((err) => {
                    console.error("Failed to connect", err);
                });

            this.tiktokConnection.on("chat", (data) => {
                let message = data.comment;
                this.onMessage(message);
            });

            this.tiktokConnection.on("gift", (data) => {
                this.onGift(data);
            });
        }
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
