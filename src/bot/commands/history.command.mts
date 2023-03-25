import { Command, CommandType } from "./command.mjs";

export class HistoryCommand extends Command {
    get type(): CommandType {
        return CommandType.History;
    }

    public handle(): void {
        this.bot.command(CommandType.History, ctx => {
            ctx.reply("HISTORY");
        });
    }
}
