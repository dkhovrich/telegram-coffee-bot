import { Middleware as TelegrafMiddleware } from "telegraf";
import LocalSession from "telegraf-session-local";
import { Middleware } from "./middleware.types.js";
import { BotContext } from "../context.mjs";

export class SessionMiddleware implements Middleware {
    create(): TelegrafMiddleware<BotContext> {
        return new LocalSession({ database: "database.json" }).middleware();
    }
}
