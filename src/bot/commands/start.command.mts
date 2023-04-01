import { Command } from "./command.mjs";
import { BotProvider } from "../bot.provider.mjs";

export class StartCommand extends Command {
    public constructor(provider: BotProvider) {
        super(provider);
    }

    handle(): void {
        this.bot.start(ctx => ctx.reply("☕️Welcome to the Coffee Capsules Bot!!️"));
    }
}
