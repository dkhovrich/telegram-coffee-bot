import { Context, Middleware as TelegrafMiddleware } from "telegraf";
import { Middleware } from "./middleware.types.mjs";
import { ConfigService } from "../../services/config.service.mjs";

export class AuthMiddleware implements Middleware {
    private readonly allowedUsers: string[];

    public constructor(config: ConfigService) {
        this.allowedUsers = config.get("ALLOWED_USERS").split(",");
    }

    create(): TelegrafMiddleware<Context> {
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
