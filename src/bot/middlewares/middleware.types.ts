import { Middleware as TelegrafMiddleware } from "telegraf";
import { BotContext } from "../context.mjs";

export interface Middleware {
    create(): TelegrafMiddleware<BotContext>;
}
