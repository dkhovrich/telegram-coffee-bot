import { z } from "zod";
import { Command } from "./command.mjs";
import { StorageService } from "../../storage/storage.types.mjs";
import { Markup, Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { getUserData } from "./utils.mjs";
import { NotificationService } from "../../services/notification.service.mjs";
import { BotFactory } from "../bot.factory.types.mts.js";
import i18next from "i18next";

export class AddCommand extends Command {
    private static readonly QUESTION_ID = "QUESTION_ID";
    private static readonly CONFIRM_BUTTON_ID = "ADD_CONFIRM_BUTTON_ID";
    private static readonly CANCEL_BUTTON_ID = "ADD_CANCEL_BUTTON_ID";
    private value: number | null = null;

    public constructor(
        private readonly storage: StorageService,
        private readonly notificationServiceFactory: BotFactory<NotificationService>
    ) {
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
            await ctx.reply(i18next.t("addCommandQuestion") as string);
        });

        question.on(message("text"), async ctx => {
            const result = z.coerce.number().safeParse(ctx.message.text);
            if (!result.success) {
                ctx.reply(i18next.t("addCommandError") as string);
                // @ts-ignore
                ctx.scene.leave();
                return;
            }

            this.value = result.data;
            const replyText = i18next.t(this.value > 0 ? "addCommandConfirmAdd" : "addCommandConfirmRemove", {
                count: Math.abs(this.value)
            });
            ctx.reply(
                replyText,
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
            const responseText = i18next.t(this.value > 0 ? "addCommandResponseAdd" : "addCommandResponseRemove", {
                count: Math.abs(this.value),
                amount
            });
            ctx.editMessageText(responseText);

            const notificationService = this.notificationServiceFactory(this.bot);
            const notificationText = i18next.t(
                this.value > 0 ? "addCommandNotificationAdd" : "addCommandNotificationRemove",
                { user: user.displayName, count: Math.abs(this.value), amount }
            );
            await notificationService.notifyAll(user.id, notificationText);
        });

        this.bot.action(AddCommand.CANCEL_BUTTON_ID, ctx => {
            ctx.editMessageText(i18next.t("addCommandCancel"));
        });
    }
}
