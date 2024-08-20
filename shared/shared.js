import { readFileSync } from "fs";

export const GeneralConfig = JSON.parse(readFileSync("./config.json", "utf8"));

export const eVotingMode = Object.freeze({
    COOLDOWN : 0,
    VOTING : 1,
    RAPID_FIRE : 2,
    ERROR : 3
});

export const ePickedVote = Object.freeze({
    UNDETERMINED: -1,
    NONE: 0,

    FIRST: 1 << 0,
    SECOND: 1 << 1,
    THIRD: 1 << 2,

    FIRST_SECOND: 1 << 0 | 1 << 1,
    FIRST_THIRD: 1 << 0 | 1 << 2,
    SECOND_THIRD: 1 << 1 | 1 << 2,

    ALL: 1 << 0 | 1 << 1 | 1 << 2,
});