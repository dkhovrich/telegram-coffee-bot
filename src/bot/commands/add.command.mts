import { z } from "zod";
import { Command } from "./command.mjs";
import { StorageService } from "../../storage/storage.types.mjs";
import { Markup, Scenes } from "telegraf";
import { message } from "telegraf/filters";

export class AddCommand extends Command {
    private static readonly QUESTION_ID = "QUESTION_ID";
    private static readonly CONFIRM_BUTTON_ID = "CONFIRM_BUTTON_ID";
    private static readonly CANCEL_BUTTON_ID = "CANCEL_BUTTON_ID";
    private value: number | null = null;

    public constructor(private readonly storage: StorageService) {
        super();
    }

    public handle(): void {
        const scene = this.createQuestion();
        // @ts-ignore
        const stage = new Scenes.Stage([scene]);
        // @ts-ignore
        this.bot.use(stage.middleware());
        // @ts-ignore
        this.bot.command("add", ctx => ctx.scene.enter(AddCommand.QUESTION_ID));
        this.handleConfirmationActions();
    }

    private createQuestion(): Scenes.BaseScene {
        const question = new Scenes.BaseScene(AddCommand.QUESTION_ID);

        question.enter(async ctx => {
            this.value = null;
            await ctx.reply("How many capsules would you like to add? ☕️");
        });

        question.on(message("text"), async ctx => {
            const result = z.coerce.number().safeParse(ctx.message.text);
            if (!result.success) {
                ctx.reply("Invalid value. Please use /add command again ⚠️");
                // @ts-ignore
                ctx.scene.leave();
                return;
            }

            this.value = result.data;
            ctx.reply(
                `Are you sure you want to ${this.value > 0 ? "add" : "remove"} ${Math.abs(this.value)} capsules? 🤔`,
                Markup.inlineKeyboard([
                    Markup.button.callback("Yes", AddCommand.CONFIRM_BUTTON_ID),
                    Markup.button.callback("No", AddCommand.CANCEL_BUTTON_ID)
                ])
            );

            // @ts-ignore
            ctx.scene.leave();
        });

        return question;
    }

    private handleConfirmationActions(): void {
        this.bot.action(AddCommand.CONFIRM_BUTTON_ID, async ctx => {
            if (this.value == null || ctx.from == null) return;
            const amount = await this.storage.add(this.value, ctx.from.username ?? ctx.from.first_name);
            const text = `${this.value > 0 ? "Added" : "Removed"} ${this.value} capsules. Total amount: ${amount}`;
            ctx.editMessageText(text);
        });

        this.bot.action(AddCommand.CANCEL_BUTTON_ID, ctx => {
            ctx.editMessageText("Okay, come back with capsules later! ☕️");
        });
    }
}
