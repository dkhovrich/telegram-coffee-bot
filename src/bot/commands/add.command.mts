import { Markup } from "telegraf";
import { message } from "telegraf/filters";
import { z } from "zod";
import { Command, CommandType } from "./command.mjs";

export class AddCommand extends Command {
    private count: number | null = null;
    private static readonly confirmButtonId = "confirm";
    private static readonly cancelButtonId = "cancel";

    get type(): CommandType {
        return CommandType.Add;
    }

    public handle(): void {
        this.bot.command(CommandType.Add, ctx => {
            this.setCommandState(ctx.session);
            ctx.reply("How many capsules would you like to add? ☕️");
        });

        this.handleText();
        this.handleActions();
    }

    private handleText(): void {
        this.bot.on(message("text"), ctx => {
            if (!this.isProcessingCommand(ctx.session)) return;

            const result = z.coerce.number().safeParse(ctx.message.text);
            if (!result.success) {
                ctx.reply("Please enter a valid number ⚠️");
                return;
            }

            this.count = result.data;
            const message =
                this.count > 0
                    ? `Are you sure you want to add ${Math.abs(this.count)} capsules? 🤔`
                    : `Are you sure you want to remove ${Math.abs(this.count)} capsules? 🤔`;

            ctx.reply(
                message,
                Markup.inlineKeyboard([
                    Markup.button.callback("Yes", AddCommand.confirmButtonId),
                    Markup.button.callback("No", AddCommand.cancelButtonId)
                ])
            );
        });
    }

    private handleActions(): void {
        this.bot.action(AddCommand.confirmButtonId, ctx => {
            ctx.editMessageText("CONFIRMED");
            this.clearCommandState(ctx.session);
        });

        this.bot.action(AddCommand.cancelButtonId, ctx => {
            ctx.editMessageText("CANCELLED");
            this.clearCommandState(ctx.session);
        });
    }
}
