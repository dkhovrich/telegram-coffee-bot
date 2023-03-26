import { Command } from "./command.mjs";

export class HistoryCommand extends Command {
    public handle(): void {
        this.bot.command("history", ctx => {
            ctx.reply("HISTORY");
        });
    }
}
