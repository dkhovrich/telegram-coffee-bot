import { Command } from "./command.mjs";
import { t } from "i18next";

export class StartCommand extends Command {
    handle(): void {
        this.bot.start(ctx => ctx.reply(t("startCommandReply") as string));
    }
}
