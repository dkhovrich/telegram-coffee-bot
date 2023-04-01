import { Command } from "./command.mjs";
import { Markup } from "telegraf";
import { StorageService } from "../../storage/storage.types.mjs";
import { getUserData } from "./utils.mjs";
import { NotificationService } from "../../services/notification.service.mjs";
import { BotProvider } from "../bot.provider.mjs";

export class RecycleCommand extends Command {
    private static readonly CONFIRM_BUTTON_ID = "RESET_CONFIRM_BUTTON_ID";
    private static readonly CANCEL_BUTTON_ID = "RESET_CANCEL_BUTTON_ID";
    private static readonly MIN_RECYCLE_AMOUNT = 100;

    public constructor(
        provider: BotProvider,
        private readonly storage: StorageService,
        private readonly notificationService: NotificationService
    ) {
        super(provider);
    }

    public handle(): void {
        this.bot.command("recycle", async ctx => {
            const amount = await this.storage.get();
            if (amount < RecycleCommand.MIN_RECYCLE_AMOUNT) {
                ctx.reply("🤷You don't have enough capsules to recycle");
                return;
            }
            ctx.reply(
                "🤔Are you sure you want to recycle all your capsules?",
                Markup.inlineKeyboard([
                    Markup.button.callback("Yes", RecycleCommand.CONFIRM_BUTTON_ID),
                    Markup.button.callback("No", RecycleCommand.CANCEL_BUTTON_ID)
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
            ctx.editMessageText("🌱All capsules have been recycled");
            await this.notificationService.notifyAll(user.id, `🌱${user.displayName} has recycled all capsules`);
        });

        this.bot.action(RecycleCommand.CANCEL_BUTTON_ID, async ctx => {
            ctx.editMessageText("☕️Okay, come back with capsules later");
        });
    }
}
