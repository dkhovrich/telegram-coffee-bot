import { z } from "zod";
import { Command } from "./command.mjs";
import { StorageService } from "../../storage/storage.types.mjs";
import { Markup, Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { getUserData } from "./utils.mjs";
import { NotificationService } from "../../services/notification.service.mjs";
import { BotProvider } from "../bot.provider.mjs";

export class AddCommand extends Command {
    private static readonly QUESTION_ID = "QUESTION_ID";
    private static readonly CONFIRM_BUTTON_ID = "ADD_CONFIRM_BUTTON_ID";
    private static readonly CANCEL_BUTTON_ID = "ADD_CANCEL_BUTTON_ID";
    private value: number | null = null;

    public constructor(
        provider: BotProvider,
        private readonly storage: StorageService,
        private readonly notificationService: NotificationService
    ) {
        super(provider);
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
            await ctx.reply("☕️How many capsules would you like to add??️");
        });

        question.on(message("text"), async ctx => {
            const result = z.coerce.number().safeParse(ctx.message.text);
            if (!result.success) {
                ctx.reply("⚠️Invalid value. Please use /add command again");
                // @ts-ignore
                ctx.scene.leave();
                return;
            }

            this.value = result.data;
            ctx.reply(
                `🤔Are you sure you want to ${this.value > 0 ? "add" : "remove"} ${Math.abs(this.value)} capsules?`,
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

            const user = getUserData(ctx.from);
            const amount = await this.storage.add(this.value, user.name);
            ctx.editMessageText(AddCommand.getConfirmationResponseText(this.value, amount));

            const notificationText = AddCommand.getConfirmationNotificationText(user.displayName, this.value, amount);
            await this.notificationService.notifyAll(user.id, notificationText);
        });

        this.bot.action(AddCommand.CANCEL_BUTTON_ID, ctx => {
            ctx.editMessageText("🥲️Okay, come back with capsules later ");
        });
    }

    private static getConfirmationResponseText(value: number, amount: number): string {
        return `🫡${value > 0 ? "Added" : "Removed"} ${Math.abs(value)} capsules. Total amount: ${amount}`;
    }

    private static getConfirmationNotificationText(user: string, value: number, amount: number): string {
        return ` 🫡${user} has ${value > 0 ? "added" : "removed"} ${Math.abs(value)} capsules\nTotal amount: ${amount}`;
    }
}
