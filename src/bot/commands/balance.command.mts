import { Command } from "./command.mjs";
import { StorageService } from "../../services/storage.service.mjs";

export class BalanceCommand extends Command {
    public constructor(private readonly storage: StorageService) {
        super();
    }

    public handle(): void {
        this.bot.command("balance", async ctx => {
            const amount = await this.storage.getAmount();
            ctx.reply(`Capsules amount: ${amount}`);
        });
    }
}
