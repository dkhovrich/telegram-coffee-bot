import { Context, Middleware as TelegrafMiddleware } from "telegraf";
import { Middleware } from "./middleware.types.mjs";
import { UsersService } from "../../services/users.service.mjs";

export class AuthMiddleware implements Middleware {
    public constructor(private readonly usersService: UsersService) {}

    public create(): TelegrafMiddleware<Context> {
        return async (ctx, next) => {
            if (ctx.from == null || !this.usersService.isAllowed(ctx.from.id)) {
                await ctx.reply("You are not allowed to use this bot ⛔");
                return;
            }
            await next();
        };
    }
}
