import { TelegrafBot } from "./types.mjs";

export interface Bot {
    init(): Promise<void>;
    start(): Promise<void>;
}

export type BotFactory<T> = (bot: TelegrafBot) => T;
