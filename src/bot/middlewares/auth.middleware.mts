import { Middleware as TelegrafMiddleware } from "telegraf";
import { Middleware } from "./middleware.types.js";
import { BotContext } from "../context.mjs";

export class AuthMiddleware implements Middleware {
    private readonly allowedUsers = [];

    create(): TelegrafMiddleware<BotContext> {
        return async (ctx, next) => {
            const user = ctx.from?.username;
            if (user == null || !this.allowedUsers.includes(user)) {
                await ctx.reply("You are not allowed to use this bot ⛔");
                return;
            }
            await next();
        };
    }
}
