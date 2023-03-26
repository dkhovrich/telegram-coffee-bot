import { Markup, Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { z } from "zod";
import { Command } from "./command.mjs";
import { StorageService } from "../../services/storage.service.mjs";

export class AddCommand extends Command {
    private count: number | null = null;
    private static readonly confirmButtonId = "confirm";
    private static readonly cancelButtonId = "cancel";

    public constructor(private readonly storage: StorageService) {
        super();
    }

    public handle(): void {
        const question = this.createQuestionScene();
        // @ts-ignore
        const stage = new Scenes.Stage([question]);
        // @ts-ignore
        this.bot.use(stage.middleware());

        // @ts-ignore
        this.bot.command("add", ctx => ctx.scene.enter("question"));

        this.handleActions();
    }

    private createQuestionScene(): Scenes.BaseScene {
        const question = new Scenes.BaseScene("question");

        question.enter(ctx => ctx.reply("How many capsules would you like to add? ☕️"));

        question.on(message("text"), async ctx => {
            const result = z.coerce.number().safeParse(ctx.message.text);
            if (!result.success) {
                ctx.reply("Invalid value. Please use /add command again ⚠️");
                // @ts-ignore
                return ctx.scene.leave();
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

            // @ts-ignore
            return ctx.scene.leave();
        });

        return question;
    }

    private handleActions(): void {
        this.bot.action(AddCommand.confirmButtonId, async ctx => {
            console.log("action");
            if (this.count == null || ctx.from?.username == null) return;
            const amount = await this.storage.add(this.count, ctx.from.username);
            ctx.editMessageText(
                `${this.count > 0 ? "Added" : "Removed"} ${this.count} capsules. Total amount: ${amount}`
            );
        });

        this.bot.action(AddCommand.cancelButtonId, ctx => {
            ctx.editMessageText("Okay, come back with capsules later! ☕️");
        });
    }
}
