import { Command, CommandType } from "./command.mjs";

export class BalanceCommand extends Command {
    get type(): CommandType {
        return CommandType.Balance;
    }

    public handle(): void {
        this.bot.command(CommandType.Balance, ctx => {
            ctx.reply("BALANCE");
        });
    }
}
