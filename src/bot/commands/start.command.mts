import { Command } from "./command.mjs";

export class StartCommand extends Command {
    handle(): void {
        this.bot.start(ctx => ctx.reply("☕️Welcome to the Coffee Capsules Bot!"));
    }
}
