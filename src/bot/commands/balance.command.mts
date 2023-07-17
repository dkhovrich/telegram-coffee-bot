import { Command } from "./command.mjs";
import { t } from "i18next";
import { CapsulesService } from "../../services/capsules.service.mjs";

export class BalanceCommand extends Command {
    public constructor(private readonly capsulesService: CapsulesService) {
        super();
    }

    public handle(): void {
        this.bot.command("balance", async ctx => {
            const amount = await this.capsulesService.getAmount();
            ctx.reply(t("balanceCommandReply", { amount }) as string);
        });
    }
}
