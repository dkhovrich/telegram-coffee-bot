import { z } from "zod";
import { Command } from "./command.mjs";
import { Markup, Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { getUserData } from "./utils.mjs";
import { NotificationService } from "../../services/notification.service.mjs";
import { t } from "i18next";
import { BotContext } from "../types.mjs";
import { BotFactory } from "../bot.types.mjs";
import { CapsulesService } from "../../services/capsules.service.mjs";

export class AddCommand extends Command {
    private static readonly QUESTION_ID = "QUESTION_ID";
    private static readonly CONFIRM_BUTTON_ID = "ADD_CONFIRM_BUTTON_ID";
    private static readonly CANCEL_BUTTON_ID = "ADD_CANCEL_BUTTON_ID";

    public constructor(
        private readonly capsulesService: CapsulesService,
        notificationServiceFactory: BotFactory<NotificationService>
    ) {
        super(notificationServiceFactory);
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

    private createQuestion(): Scenes.BaseScene<BotContext> {
        const question = new Scenes.BaseScene<BotContext>(AddCommand.QUESTION_ID);

        question.enter(async ctx => {
            ctx.session.addValue = null;
            await ctx.reply(t("addCommandQuestion") as string);
        });

        question.on(message("text"), async ctx => {
            const result = z.coerce.number().safeParse(ctx.message.text);
            if (!result.success) {
                ctx.reply(t("addCommandError") as string);
                // @ts-ignore
                ctx.scene.leave();
                return;
            }

            ctx.session.addValue = result.data;
            const replyText = t(result.data > 0 ? "addCommandConfirmAdd" : "addCommandConfirmRemove", {
                count: Math.abs(result.data)
            });
            ctx.reply(
                replyText,
                Markup.inlineKeyboard([
                    Markup.button.callback(t("no"), AddCommand.CANCEL_BUTTON_ID),
                    Markup.button.callback(t("yes"), AddCommand.CONFIRM_BUTTON_ID)
                ])
            );

            // @ts-ignore
            ctx.scene.leave();
        });

        return question;
    }

    private handleConfirmationActions(): void {
        this.bot.action(AddCommand.CONFIRM_BUTTON_ID, async ctx => {
            if (ctx.session.addValue == null || ctx.from == null) return;

            const user = getUserData(ctx.from);
            const amount = await this.capsulesService.add(ctx.session.addValue, user.name);
            const responseText = t(ctx.session.addValue > 0 ? "addCommandResponseAdd" : "addCommandResponseRemove", {
                count: Math.abs(ctx.session.addValue),
                amount
            });
            ctx.editMessageText(responseText);

            await this.notificationService.notifyAdd(user, ctx.session.addValue, amount);
            ctx.session.addValue = null;
        });

        this.bot.action(AddCommand.CANCEL_BUTTON_ID, ctx => {
            ctx.editMessageText(t("addCommandCancel"));
            ctx.session.addValue = null;
        });
    }
}
