import { Context } from "telegraf";

export interface SessionData {
    courseLike: boolean;
}

export interface BotContext extends Context {
    session: SessionData;
}
