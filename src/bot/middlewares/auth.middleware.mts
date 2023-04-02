import { Context, Middleware as TelegrafMiddleware } from "telegraf";
import { Middleware } from "./middleware.types.mjs";
import { UsersService } from "../../services/users.service.mjs";
import { t } from "i18next";

export class AuthMiddleware implements Middleware {
    public constructor(private readonly usersService: UsersService) {}

    public create(): TelegrafMiddleware<Context> {
        return async (ctx, next) => {
            if (ctx.from == null || !this.usersService.isAllowed(ctx.from.id)) {
                await ctx.reply(t("authMiddlewareError") as string);
                return;
            }
            await next();
        };
    }
}
