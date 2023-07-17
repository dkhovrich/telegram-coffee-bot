import { Command } from "./command.mjs";
import { Markup } from "telegraf";
import { getUserData, UserData } from "./utils.mjs";
import { NotificationService } from "../../services/notification.service.mjs";
import { t } from "i18next";
import { BotFactory } from "../bot.types.mjs";
import { CapsulesService } from "../../services/capsules.service.mjs";

export class RecycleCommand extends Command {
    private static readonly CONFIRM_BUTTON_ID = "RESET_CONFIRM_BUTTON_ID";
    private static readonly CANCEL_BUTTON_ID = "RESET_CANCEL_BUTTON_ID";

    public constructor(
        private readonly capsulesService: CapsulesService,
        private readonly notificationServiceFactory: BotFactory<NotificationService>
    ) {
        super();
    }

    public handle(): void {
        this.bot.command("recycle", async ctx => {
            const canRecycle = await this.capsulesService.canRecycle();
            if (!canRecycle) {
                ctx.reply(t("recycleCommandNotEnough") as string);
                return;
            }
            ctx.reply(
                t("recycleCommandQuestion") as string,
                Markup.inlineKeyboard([
                    Markup.button.callback(t("no"), RecycleCommand.CANCEL_BUTTON_ID),
                    Markup.button.callback(t("yes"), RecycleCommand.CONFIRM_BUTTON_ID)
                ])
            );
        });
        this.handleConfirmationActions();
    }

    private handleConfirmationActions(): void {
        this.bot.action(RecycleCommand.CONFIRM_BUTTON_ID, async ctx => {
            if (ctx.from == null) return;

            const canRecycle = await this.capsulesService.canRecycle();
            if (!canRecycle) {
                ctx.reply(t("recycleCommandNotEnough") as string);
                return;
            }

            const user = getUserData(ctx.from);
            await this.capsulesService.recycle(user.name);
            ctx.editMessageText(t("recycleCommandResponse"));

            await this.notify(user);
        });

        this.bot.action(RecycleCommand.CANCEL_BUTTON_ID, async ctx => {
            ctx.editMessageText(t("recycleCommandCancel"));
        });
    }

    private async notify(user: UserData): Promise<void> {
        const notificationService = this.notificationServiceFactory(this.bot);
        await notificationService.notifyAll(user.id, t("recycleCommandNotification", { user: user.displayName }));
    }
}
