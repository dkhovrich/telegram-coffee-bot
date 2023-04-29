import { TelegrafBot } from "./types.mjs";

export type BotFactory<T> = (bot: TelegrafBot) => T;
