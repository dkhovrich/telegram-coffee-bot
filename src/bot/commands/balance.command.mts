import { Command } from "./command.mjs";
import { t } from "i18next";
import { CapsulesService } from "../../services/capsules.service.mjs";
import { BotFactory } from "../bot.types.mjs";
import { NotificationService } from "../../services/notification.service.mjs";

export class BalanceCommand extends Command {
    public constructor(
        private readonly capsulesService: CapsulesService,
        notificationServiceFactory: BotFactory<NotificationService>
    ) {
        super(notificationServiceFactory);
    }

    public handle(): void {
        this.bot.command("balance", async ctx => {
            const amount = await this.capsulesService.getAmount();
            ctx.reply(t("balanceCommandReply", { amount }) as string);
        });
    }
}
