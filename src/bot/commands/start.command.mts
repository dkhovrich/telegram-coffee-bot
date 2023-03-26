import { fmt } from "telegraf/format";
import { Command } from "./command.mjs";

export class StartCommand extends Command {
    handle(): void {
        this.bot.start(ctx => {
            ctx.reply(fmt`Please use one of the following commands: /add, /reset, /balance, /history`);
        });
    }
}
