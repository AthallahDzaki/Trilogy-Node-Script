import { execSync } from "child_process";

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function findRunningProcess(processName) {
    const command = `tasklist /fi "imagename eq ${processName}"`;
    try {
        const output = execSync(command).toString();
        return output.includes(processName);
    } catch (err) {
        return false;
    }
}