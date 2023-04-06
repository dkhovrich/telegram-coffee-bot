import { Command } from "./command.mjs";
import { Markup } from "telegraf";
import { StorageService } from "../../storage/storage.types.mjs";
import { getUserData } from "./utils.mjs";
import { NotificationService } from "../../services/notification.service.mjs";
import { BotFactory } from "../bot.factory.types.mjs";
import { t } from "i18next";

export class RecycleCommand extends Command {
    private static readonly CONFIRM_BUTTON_ID = "RESET_CONFIRM_BUTTON_ID";
    private static readonly CANCEL_BUTTON_ID = "RESET_CANCEL_BUTTON_ID";
    private static readonly MIN_RECYCLE_AMOUNT = 100;

    public constructor(
        private readonly storage: StorageService,
        private readonly notificationServiceFactory: BotFactory<NotificationService>
    ) {
        super();
    }

    public handle(): void {
        this.bot.command("recycle", async ctx => {
            const amount = await this.storage.get();
            if (amount < RecycleCommand.MIN_RECYCLE_AMOUNT) {
                ctx.reply(t("recycleCommandNotEnough") as string);
                return;
            }
            ctx.reply(
                t("recycleCommandQuestion") as string,
                Markup.inlineKeyboard([
                    Markup.button.callback("No", RecycleCommand.CANCEL_BUTTON_ID),
                    Markup.button.callback("Yes", RecycleCommand.CONFIRM_BUTTON_ID)
                ])
            );
        });
        this.handleConfirmationActions();
    }

    private handleConfirmationActions(): void {
        this.bot.action(RecycleCommand.CONFIRM_BUTTON_ID, async ctx => {
            if (ctx.from == null) return;

            const user = getUserData(ctx.from);
            await this.storage.recycle(user.name);
            ctx.editMessageText(t("recycleCommandResponse"));

            const notificationService = this.notificationServiceFactory(this.bot);
            await notificationService.notifyAll(user.id, t("recycleCommandNotification", { user: user.displayName }));
        });

        this.bot.action(RecycleCommand.CANCEL_BUTTON_ID, async ctx => {
            ctx.editMessageText(t("recycleCommandCancel"));
        });
    }
}
