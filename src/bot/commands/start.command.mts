import { fmt } from "telegraf/format";
import { Command, CommandType } from "./command.mjs";

export class StartCommand extends Command {
    get type(): CommandType {
        return CommandType.Start;
    }

    handle(): void {
        this.bot.start(ctx => {
            this.setCommandState(ctx.session);
            ctx.reply(
                fmt`Please use one of the following commands: /${CommandType.Add}, /${CommandType.Reset}, /${CommandType.Balance}, /${CommandType.History}`
            );
        });
    }
}
