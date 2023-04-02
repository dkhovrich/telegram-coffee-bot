import { Context, Telegraf } from "telegraf";

export type BotFactory<T> = (bot: Telegraf<Context>) => T;
