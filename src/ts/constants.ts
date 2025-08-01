import { id } from "../module.json";

export const moduleId = id;

export function getGame(): Game {
    const result = game as foundry.Game;
    if (!result) {
        throw new Error('game is not initialized yet!');
    }
    return result;
}
