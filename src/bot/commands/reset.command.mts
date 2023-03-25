import { Command, CommandType } from "./command.mjs";

export class ResetCommand extends Command {
    get type(): CommandType {
        return CommandType.Reset;
    }

    public handle(): void {
        this.bot.command(CommandType.Reset, ctx => {
            ctx.reply("RESET");
        });
    }
}
