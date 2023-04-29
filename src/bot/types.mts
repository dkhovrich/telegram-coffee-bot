import { Context, Telegraf } from "telegraf";

export interface Session {
    addValue: number | null;
}

export interface BotContext extends Context {
    session: Session;
}

export type TelegrafBot = Telegraf<BotContext>;
