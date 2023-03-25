import { Command } from "./command.mjs";
import { Markup, Telegraf } from "telegraf";
import { BotContext } from "../context.mjs";

export class StartCommand extends Command {
    handle(bot: Telegraf<BotContext>): void {
        bot.start(ctx => {
            console.log(ctx);
            ctx.reply(
                "Hello!",
                Markup.inlineKeyboard([
                    Markup.button.callback("Like", "like"),
                    Markup.button.callback("Dislike", "dislike")
                ])
            );
        });

        bot.action("like", ctx => {
            ctx.session.courseLike = true;
            ctx.editMessageText("You liked the course!");
        });

        bot.action("dislike", ctx => {
            ctx.session.courseLike = false;
            ctx.editMessageText("You disliked the course!");
        });
    }
}
