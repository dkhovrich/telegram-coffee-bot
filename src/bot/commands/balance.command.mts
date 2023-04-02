import { Command } from "./command.mjs";
import { StorageService } from "../../storage/storage.types.mjs";
import i18next from "i18next";

export class BalanceCommand extends Command {
    public constructor(private readonly storage: StorageService) {
        super();
    }

    public handle(): void {
        this.bot.command("balance", async ctx => {
            const amount = await this.storage.get();
            ctx.reply(i18next.t("balanceCommandReply", { amount }) as string);
        });
    }
}
