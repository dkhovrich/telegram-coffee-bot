import { Command } from "./command.mjs";
import i18next from "i18next";

export class StartCommand extends Command {
    handle(): void {
        this.bot.start(ctx => ctx.reply(i18next.t("startCommandReply") as string));
    }
}
