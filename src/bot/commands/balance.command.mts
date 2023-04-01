import { Command } from "./command.mjs";
import { StorageService } from "../../storage/storage.types.mjs";
import { BotProvider } from "../bot.provider.mjs";

export class BalanceCommand extends Command {
    public constructor(provider: BotProvider, private readonly storage: StorageService) {
        super(provider);
    }

    public handle(): void {
        this.bot.command("balance", async ctx => {
            const amount = await this.storage.get();
            ctx.reply(`Capsules amount: ${amount}`);
        });
    }
}
