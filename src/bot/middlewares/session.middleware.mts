import { Context, Middleware as TelegrafMiddleware } from "telegraf";
import LocalSession from "telegraf-session-local";
import { Middleware } from "./middleware.types.js";

export class SessionMiddleware implements Middleware {
    create(): TelegrafMiddleware<Context> {
        return new LocalSession({ database: "database.json" }).middleware();
    }
}
